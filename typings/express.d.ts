declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    locale: import('@common/enum/locale').LocaleType;
  }
}
