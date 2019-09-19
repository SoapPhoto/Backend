/* eslint-disable no-dupe-class-members */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable, UnauthorizedException, BadGatewayException,
} from '@nestjs/common';
import axios from 'axios';

import SocksProxyAgent from 'socks-proxy-agent';
import { RedisService } from 'nestjs-redis';
import { OauthStateType } from '@common/enum/oauthState';
import { OauthType } from '@common/enum/router';
import { ClientService } from './client/client.service';
import { IGithubUserInfo, IGoogleUserInfo } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CredentialsService } from '../credentials/credentials.service';
import { SignupType } from '../user/enum/signup.type.enum';
import { Status } from '../user/enum/status.enum';
import { OauthQueryDto } from './dto/oauth.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class OauthService {
  private github_authorize = 'https://github.com/login/oauth/access_token'

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
      const { data } = await axios.get<IGithubUserInfo>('https://api.github.com/user', {
        headers: {
          accept: 'application/json',
          Authorization: `token ${info.access_token}`,
        },
      });
      await this.saveOauthInfo(code, state, OauthType.GITHUB, data.id, data);
    } else {
      throw new UnauthorizedException('No GITHUB Oauth error');
    }
    return code;
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
        redirect_uri: 'http://localhost:3002/oauth/google/redirect',
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
      await this.saveOauthInfo(code, state, OauthType.GOOGLE, data.sub, data);
    }
    return code;
  }

  // public async saveOauthInfo(code: string, state: OauthStateType, type: OauthType.GOOGLE, id: ID, data: IGoogleUserInfo): Promise<void>

  // public async saveOauthInfo(code: string, state: OauthStateType, type: OauthType.GITHUB, id: ID, data: IGithubUserInfo): Promise<void>

  public async saveOauthInfo(code: string, state: OauthStateType, type: OauthType, id: ID, data: IGoogleUserInfo | IGithubUserInfo): Promise<void> {
    const redisClient = this.redisService.getClient();
    if (state === OauthStateType.login) {
      const user = await this.verifyUser(type, id, data);
      if (!user) throw new UnauthorizedException('No Credential Info');
      await redisClient.set(`oauth_code_${code}`, JSON.stringify({
        type,
        client: await this.clientService.getBaseClient(),
        user,
      }), 'EX', 2000);
    } else if (state === OauthStateType.authorize) {
      const cr = await this.credentialsService.getInfo(`${type}_${id}`);
      if (cr) {
        throw new BadGatewayException('authorized user');
      }
      await redisClient.set(`oauth_authorize_${code}`, JSON.stringify({
        type,
        data,
      }), 'EX', 2000);
    }
  }

  // public async verifyUser(type: OauthType.GITHUB, id: ID, data: IGithubUserInfo): Promise<UserEntity | null>

  // public async verifyUser(type: OauthType.GOOGLE, id: ID, data: IGoogleUserInfo): Promise<UserEntity | null>

  public async verifyUser(type: OauthType, id: ID, data: IGithubUserInfo | IGoogleUserInfo): Promise<UserEntity | null> {
    const cr = await this.credentialsService.getInfo(`${type}_${id}`);
    if (cr && cr.isActive) {
      return cr.user;
    }
    let newCr;
    if (cr) {
      newCr = cr;
    } else {
      newCr = await this.credentialsService.create({
        id: `${type}_${id}`,
        type,
        info: data,
      });
    }
    let createData: Partial<UserEntity> = {};
    switch (type) {
      case OauthType.GOOGLE:
        // eslint-disable-next-line no-case-declarations
        const googleData = data as IGoogleUserInfo;
        createData = {
          username: `${googleData.family_name}-${googleData.given_name}`,
          name: data.name,
          status: Status.VERIFIED,
        };
        break;
      case OauthType.GITHUB:
        // eslint-disable-next-line no-case-declarations
        const githubData = data as IGithubUserInfo;
        createData = {
          username: githubData.login,
          name: githubData.name,
          status: Status.VERIFIED,
          bio: githubData.bio,
          website: githubData.blog,
          signupType: (type as any) as SignupType,
        };
        break;
      default:
        return null;
    }
    return this.userService.createOauthUser({
      ...createData,
      credentials: [newCr],
      signupType: (type as any) as SignupType,
    });
  }
}
