import { Injectable } from '@nestjs/common';
import Instagram from 'node-instagram';

@Injectable()
export class InstagramService {
  public instagram: Instagram;
  constructor() {
    this.instagram = new Instagram({
      clientId: 'd45d6eed61ec48c5b0fb29f9fd17eaed',
      clientSecret: '',
      accessToken: '1456582124.1677ed0.0976d264b6f24ff5b57d97d5c17e1407',
    });
  }
  public test() {
    console.log(41214124);
    this.instagram.get('users/self', (err: any, data: any) => {
      console.log(err, data);
    });
  }
}
