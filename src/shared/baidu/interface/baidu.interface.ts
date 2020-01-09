
export interface IBaiduToken {
  refresh_token: string;
  expires_in: number;
  session_key: string;
  access_token: string;
  scope: string;
  session_secret: string;
}

export interface IBaiduClassify {
  score: number;
  root: string;
  keyword: string;
}
