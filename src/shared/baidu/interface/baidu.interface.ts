import { Exclude, Expose } from 'class-transformer/decorators';

export class BaiduToken {
  public refresh_token!: string;

  public expires_in!: number;

  public session_key!: string;

  public access_token!: string;

  public scope!: string;

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
