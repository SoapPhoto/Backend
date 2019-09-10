import { Injectable } from '@nestjs/common';
import https from 'https';
import url from 'url';
import SocksProxyAgent from 'socks-proxy-agent';

@Injectable()
export class InstagramService {
  public access_token = '1456582124.1677ed0.0976d264b6f24ff5b57d97d5c17e1407';

  private insUrl = 'https://api.instagram.com/v1';

  public async test() {
    return this.get('/users/self/media/recent');
  }

  public async test1(id: string) {
    return this.get(`/media/${id}`);
  }

  public async test2() {
    // const ig = new IgApiClient();
    // ig.state.generateDevice('yu7er');
    // ig.request.defaults.agentClass = shttps;
    // ig.request.defaults.agentOptions = {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //   // @ts-ignore
    //   socksHost: '127.0.0.1',
    //   socksPort: 1080,
    // };
    // const loggedInUser = await ig.account.login('xxx', 'xxx');
    // return myPostsFirstPage;
  }

  // 封装请求
  private async get<T>(path: string): Promise<T> {
    const opts = url.parse(`${this.insUrl}${path}?access_token=${this.access_token}`);
    (opts as any).agent = new SocksProxyAgent('socks://127.0.0.1:1080');
    return new Promise((resolve, reject) => {
      const req = https.get(opts, (res) => {
        const chunks: any[] = [];
        res.on('data', (data) => {
          chunks.push(data);
        });
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(JSON.parse(buffer.toString()));
        });
      });
      req.on('error', (e) => {
        reject(e);
      });
    });
  }
}
