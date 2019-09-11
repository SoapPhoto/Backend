/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, ForbiddenException } from '@nestjs/common';
import axios from 'axios';

import SocksProxyAgent from 'socks-proxy-agent';
import { RedisService } from 'nestjs-redis';
import { OauthType } from './enum/oauth-type.enum';
import { ClientService } from './client/client.service';
import { IGithubUserInfo } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CredentialsService } from '../credentials/credentials.service';
import { SignupType } from '../user/enum/signup.type.enum';
import { Status } from '../user/enum/status.enum';

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

  public async github({ code }: { code: string }) {
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
      const user = await this.verifyUser(OauthType.GITHUB, data.id, data.email, data);
      console.log(user);
      // const client = this.redisService.getClient();
      // await client.set(`oauth_code_${code}`, JSON.stringify({
      //   type: OauthType.github,
      //   client: await this.clientService.getBaseClient(),
      //   data,
      // }), 'EX', 10000);
    } else {
      throw new ForbiddenException();
    }
    return code;
  }

  public async google({ code }: { code: string }) {
    const proxyOptions = 'socks5://127.0.0.1:1080';
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
      console.log(data);
    }
    return code;
  }

  public verifyUser = async (type: OauthType, id: ID, email: string, data: IGithubUserInfo) => {
    const cr = await this.credentialsService.getInfo(`${type}_${id}`);
    if (cr) {
      return cr.user;
    }
    const user = await this.userService.getEmailUser(email);
    if (!user) {
      if (type === OauthType.GITHUB) {
        const newCr = await this.credentialsService.create({
          id: `${type}_${id}`,
          info: data,
        });
        return this.userService.createOauthUser({
          email,
          username: data.name,
          status: Status.VERIFIED,
          bio: data.bio,
          website: data.blog,
          credentials: [newCr],
          signupType: (type as any) as SignupType,
        });
      }
    }
    throw new ForbiddenException();
  }
}
