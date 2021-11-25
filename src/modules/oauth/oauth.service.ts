/* eslint-disable camelcase */
/* eslint-disable no-dupe-class-members */
/* eslint-disable max-len */
import {
  Injectable, UnauthorizedException, BadGatewayException, BadRequestException,
} from '@nestjs/common';
import axios from 'axios';

import SocksProxyAgent from 'socks-proxy-agent';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { OauthStateType, OauthActionType } from '@common/enum/oauthState';
import { OauthType } from '@common/enum/router';
import { SignupType } from '@common/enum/signupType';
import { Status } from '@common/enum/userStatus';
import { ValidationException } from '@server/common/exception/validation.exception';
import { ClientService } from './client/client.service';
import {
  IOauthUserInfo, IGithubUserInfo, IWeiboUserInfo,
} from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CredentialsService } from '../credentials/credentials.service';
import { OauthQueryDto, ActiveUserDto } from './dto/oauth.dto';
import { CredentialsEntity } from '../credentials/credentials.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class OauthService {
  private github_authorize = 'https://github.com/login/oauth/access_token';

  private weibo_authorize = 'https://api.weibo.com/oauth2/access_token';

  private google_authorize = 'https://www.googleapis.com/oauth2/v4/token';

  constructor(
    private readonly redisManager: RedisManager,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly credentialsService: CredentialsService,
  ) { }

  public async github({ code, state }: OauthQueryDto) {
    const proxyOptions = 'socks5://127.0.0.1:7890';
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    const { data: info } = await axios.post(this.github_authorize, {}, {
      params: {
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        accept: 'application/json',
      },
      httpsAgent,
    });
    console.log(info);
    if (info.access_token) {
      try {
        const { data } = await axios.get('https://api.github.com/user', {
          headers: {
            accept: 'application/json',
            Authorization: `token ${info.access_token}`,
          },
          httpsAgent,
        });
        // console.log(data);
        console.log(state);
        return this.saveOauthInfo(code, state, OauthType.GITHUB, data.id, data);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') {
          throw new BadGatewayException('ECONNREFUSED');
        }
        throw new BadGatewayException('bad github');
      }
    }
    if (info.error) {
      throw info;
    }
    return null;
  }

  public async google({ code, state }: OauthQueryDto) {
    const proxyOptions = 'socks5://127.0.0.1:7890';
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    const client = axios.create({ httpsAgent });
    const { data: info } = await client.post(this.google_authorize, {}, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.OAUTH_CALLBACK_URL}/oauth/google/redirect`,
        code,
      },
      headers: {
        accept: 'application/json',
      },
    });
    if (info && info.access_token) {
      const { data } = await client.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${info.access_token}`,
        },
      });
      return this.saveOauthInfo(code, state, OauthType.GOOGLE, data.sub, data);
    }
    return null;
  }

  public async weibo({ code, state }: OauthQueryDto) {
    const { data: info } = await axios.post(this.weibo_authorize, {}, {
      params: {
        client_id: process.env.OAUTH_WEIBO_CLIENT_ID,
        client_secret: process.env.OAUTH_WEIBO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'https://soapphoto.com/oauth/weibo/redirect',
        code,
      },
      headers: {
        accept: 'application/json',
      },
    });
    if (info?.access_token) {
      const { data } = await axios.get('https://api.weibo.com/2/users/show.json', {
        params: {
          access_token: info.access_token,
          uid: info.uid,
        },
        headers: {
          accept: 'application/json',
        },
      });
      return this.saveOauthInfo(code, state, OauthType.WEIBO, data.id, data);
    }
    return null;
  }

  public async saveOauthInfo(code: string, state: OauthStateType, type: OauthType, id: number, data: IOauthUserInfo): Promise<{code: string; action: OauthActionType} | null> {
    const redisClient = this.redisManager.getClient();
    if (state === OauthStateType.login) {
      // 这边验证oauth账户，有存在的话就返回，不存在就创建并返回创建的数据
      const cr = await this.verifyUser(type, id, data);
      if (!cr) throw new UnauthorizedException('No Credential Info');
      if (cr.user) {
        await redisClient.set(`oauth:code:${code}`, JSON.stringify({
          type,
          client: await this.clientService.getBaseClient(),
          user: cr.user,
        }), 'EX', 2000);
        return { code, action: OauthActionType.login };
      }
      await redisClient.set(`oauth:active:${code}`, JSON.stringify({
        type,
        client: await this.clientService.getBaseClient(),
        cr,
      }), 'EX', 2000);
      return { code, action: OauthActionType.active };
    }
    if (state === OauthStateType.authorize) {
      const cr = await this.credentialsService.getInfo(`${type}_${id}`);
      if (cr) {
        throw new BadGatewayException('authorized user');
      }
      await redisClient.set(`oauth:authorize:${code}`, JSON.stringify({
        type,
        data,
      }), 'EX', 5000);
      return { code, action: OauthActionType.authorize };
    }
    return null;
  }

  public async verifyUser(type: OauthType, id: number, data: IOauthUserInfo): Promise<CredentialsEntity> {
    const cr = await this.credentialsService.getInfo(`${type}_${id}`);
    if (cr) {
      return cr;
    }
    return this.credentialsService.create({
      id: `${type}_${id}`,
      type,
      info: data,
    });
  }

  public async activeUser({ code, ...userInfo }: ActiveUserDto) {
    const redisClient = this.redisManager.getClient();
    const infoStr = await redisClient.get(`oauth:active:${code}`);
    if (infoStr) {
      const { type, cr } = JSON.parse(infoStr);
      let createData: Maybe<Partial<UserEntity>> = null;
      if (type === OauthType.GOOGLE) {
        createData = {
          ...userInfo,
        };
      } else if (type === OauthType.GITHUB) {
        const githubData = cr.info as IGithubUserInfo;
        createData = {
          avatar: githubData.avatar_url,
          bio: githubData.bio,
          website: githubData.blog,
          ...userInfo,
        };
      } else if (type === OauthType.WEIBO) {
        const weiboData = cr.info as IWeiboUserInfo;
        createData = {
          avatar: weiboData.avatar_hd,
          bio: weiboData.description,
          website: weiboData.url,
          ...userInfo,
        };
        createData.name = weiboData.name;
      }
      if (!createData) throw new BadRequestException('type_err');
      // 检查username是否被注册
      if (await this.userService.findOne(createData.username!, null)) {
        throw new ValidationException('username', 'username_exists');
      }
      const user = await this.userService.createOauthUser({
        ...createData,
        status: Status.VERIFIED,
        credentials: [cr],
        signupType: type as SignupType,
      });
      await redisClient.del(`oauth:active:${code}`);
      await redisClient.set(`oauth:code:${code}`, JSON.stringify({
        type,
        user,
        client: await this.clientService.getBaseClient(),
      }), 'EX', 2000);
      return {
        type,
        user,
      };
    }
    throw new BadRequestException('no_info');
  }
}
