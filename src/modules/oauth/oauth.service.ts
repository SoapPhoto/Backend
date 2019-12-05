/* eslint-disable no-dupe-class-members */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable, UnauthorizedException, BadGatewayException,
} from '@nestjs/common';
import axios from 'axios';

import SocksProxyAgent from 'socks-proxy-agent';
import { RedisService } from 'nestjs-redis';
import { OauthStateType, OauthActionType } from '@common/enum/oauthState';
import { OauthType } from '@common/enum/router';
import { ClientService } from './client/client.service';
import { IOauthUserInfo } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CredentialsService } from '../credentials/credentials.service';
import { OauthQueryDto } from './dto/oauth.dto';
import { CredentialsEntity } from '../credentials/credentials.entity';

@Injectable()
export class OauthService {
  private github_authorize = 'https://github.com/login/oauth/access_token'

  private weibo_authorize = 'https://api.weibo.com/oauth2/access_token'

  private google_authorize = 'https://www.googleapis.com/oauth2/v4/token'

  constructor(
    private readonly redisService: RedisService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly credentialsService: CredentialsService,
  ) { }

  public async github({ code, state }: OauthQueryDto) {
    const { data: info } = await axios.post(this.github_authorize, {}, {
      params: {
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        accept: 'application/json',
      },
    });
    if (info.access_token) {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          accept: 'application/json',
          Authorization: `token ${info.access_token}`,
        },
      });
      return this.saveOauthInfo(code, state, OauthType.GITHUB, data.id, data);
    }
    return null;
  }

  public async google({ code, state }: OauthQueryDto) {
    const proxyOptions = 'socks5://127.0.0.1:2081';
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    const client = axios.create({ httpsAgent });
    const { data: info } = await client.post(this.google_authorize, {}, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.URL}/oauth/google/redirect`,
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

  public async saveOauthInfo(code: string, state: OauthStateType, type: OauthType, id: ID, data: IOauthUserInfo): Promise<{code: string; action: OauthActionType} | null> {
    const redisClient = this.redisService.getClient();
    if (state === OauthStateType.login) {
      // 这边验证oauth账户，有存在的话就返回，不存在就创建并返回创建的数据
      const cr = await this.verifyUser(type, id, data);
      if (!cr) throw new UnauthorizedException('No Credential Info');
      if (cr.user) {
        await redisClient.set(`oauth.code.${code}`, JSON.stringify({
          type,
          client: await this.clientService.getBaseClient(),
          user: cr.user,
        }), 'EX', 2000);
        return { code, action: OauthActionType.login };
      }
      await redisClient.set(`oauth.active.${code}`, JSON.stringify({
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
      await redisClient.set(`oauth.authorize.${code}`, JSON.stringify({
        type,
        data,
      }), 'EX', 5000);
      return { code, action: OauthActionType.authorize };
    }
    return null;
  }

  // public async verifyUser(type: OauthType.GITHUB, id: ID, data: IGithubUserInfo): Promise<UserEntity | null>

  // public async verifyUser(type: OauthType.GOOGLE, id: ID, data: IGoogleUserInfo): Promise<UserEntity | null>

  public async verifyUser(type: OauthType, id: ID, data: IOauthUserInfo): Promise<CredentialsEntity> {
    const cr = await this.credentialsService.getInfo(`${type}_${id}`);
    if (cr) {
      return cr;
    }
    return this.credentialsService.create({
      id: `${type}_${id}`,
      type,
      info: data,
    });

    // if (cr) {
    //   newCr = cr;
    // } else {
    //   newCr = await this.credentialsService.create({
    //     id: `${type}_${id}`,
    //     type,
    //     info: data,
    //   });
    // }
    // let createData: Partial<UserEntity> = {};
    // switch (type) {
    //   case OauthType.GOOGLE:
    //     // eslint-disable-next-line no-case-declarations
    //     const googleData = data as IGoogleUserInfo;
    //     createData = {
    //       username: `${googleData.family_name}-${googleData.given_name}`,
    //       name: data.name,
    //       status: Status.VERIFIED,
    //     };
    //     break;
    //   case OauthType.GITHUB:
    //     // eslint-disable-next-line no-case-declarations
    //     const githubData = data as IGithubUserInfo;
    //     createData = {
    //       username: githubData.login,
    //       avatar: githubData.avatar_url,
    //       name: githubData.name,
    //       status: Status.VERIFIED,
    //       bio: githubData.bio,
    //       website: githubData.blog,
    //       signupType: (type as any) as SignupType,
    //     };
    //     break;
    //   // case OauthType.WEIBO:
    //   //   // eslint-disable-next-line no-case-declarations
    //   //   const weiboData = data as IWeiboUserInfo;
    //   //   createData = {
    //   //     username: weiboData.login,
    //   //     avatar: weiboData.avatar_url,
    //   //     name: weiboData.name,
    //   //     status: Status.VERIFIED,
    //   //     bio: weiboData.bio,
    //   //     website: weiboData.blog,
    //   //     signupType: (type as any) as SignupType,
    //   //   };
    //   //   break;
    //   default:
    //     return null;
    // }
    // return this.userService.createOauthUser({
    //   ...createData,
    //   credentials: [newCr],
    //   signupType: (type as any) as SignupType,
    // });
  }
}
