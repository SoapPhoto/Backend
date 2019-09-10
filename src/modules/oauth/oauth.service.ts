import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OauthService {
  private github_authorize = 'https://github.com/login/oauth/access_token'

  private google_authorize = 'https://www.googleapis.com/oauth2/v4/token'

  public async github({ code }: { code: string }) {
    const { data: info } = await axios.post(this.github_authorize, {}, {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        // eslint-disable-next-line @typescript-eslint/camelcase
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
      console.log(data);
    }
  }

  public async google({ code }: { code: string }) {
    const { data: info } = await axios.post(this.google_authorize, {}, {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'authorization_code',
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: 'http://localhost:3002/oauth/google/redirect',
        code,
      },
      headers: {
        accept: 'application/json',
      },
    });
    console.log(info);
  }
}
