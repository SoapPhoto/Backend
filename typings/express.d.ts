declare namespace Express {
  export interface Request {
    locale: import('@common/enum/locale').LocaleType;
    user: import('@server/modules/user/user.entity').UserEntity | null;
  }
}
