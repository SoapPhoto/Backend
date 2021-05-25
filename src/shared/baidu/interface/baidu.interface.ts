import { Exclude, Expose } from 'class-transformer';

export class BaiduToken {
  // eslint-disable-next-line camelcase
  public refresh_token!: string;

  // eslint-disable-next-line camelcase
  public expires_in!: number;

  // eslint-disable-next-line camelcase
  public session_key!: string;

  // eslint-disable-next-line camelcase
  public access_token!: string;

  public scope!: string;

  // eslint-disable-next-line camelcase
  public session_secret!: string;
}

@Exclude()
export class BaiduClassify {
  @Expose()
  public score!: number;

  @Expose()
  public root!: string;

  @Expose()
  public keyword!: string;
}
