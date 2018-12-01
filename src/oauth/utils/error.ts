
export class OAuthError {
  public error: any;
  public message: string | null;

  constructor (message: string | null = null, err: any = null) {
    if (err) {
      this.error = err;
    }
    this.message = message;
  }
}
