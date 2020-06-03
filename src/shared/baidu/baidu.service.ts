import { Injectable, BadGatewayException } from '@nestjs/common';
import Axios from 'axios';
import dayjs from 'dayjs';
import { qs } from 'url-parse';

import { BaiduClassify, BaiduToken } from './interface/baidu.interface';

@Injectable()
export class BaiduService {
  private token?: BaiduToken;

  private expiresDate = dayjs().toString();

  public async getAccountToken() {
    if (dayjs(this.expiresDate).isBefore(dayjs()) || !this.token) {
      const { data } = await Axios.post<BaiduToken>('https://aip.baidubce.com/oauth/2.0/token', {}, {
        params: {
          grant_type: 'client_credentials',
          client_id: process.env.BAIDU_CLIENT_ID,
          client_secret: process.env.BAIDU_CLIENT_SECRET,
        },
      });
      this.token = data;
      this.expiresDate = dayjs().add(this.token.expires_in, 's').toString();
    }
    return this.token!;
  }

  public async getImageClassify(base64: string) {
    const token = await this.getAccountToken();
    const { data } = await Axios.post<{result: BaiduClassify[]}>('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
      qs.stringify({ image: base64.split(',')[1] }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          access_token: token.access_token,
        },
      });
    if ((data as any).error_msg) {
      throw new BadGatewayException((data as any).error_msg);
    }
    if (data.result) {
      return data.result;
    }
    return [];
  }
}
