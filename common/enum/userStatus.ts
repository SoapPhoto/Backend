import { $enum } from 'ts-enum-util';

export enum Status {
  /**
   * 未验证
   */
  UNVERIFIED = 'UNVERIFIED',
  /**
   * 已验证，正常的账号
   */
  VERIFIED = 'VERIFIED',
  /**
   * 已暂停
   */
  SUSPENDED = 'SUSPENDED',
  /**
   * 被禁用，不允许登录
   */
  BANNED = 'BANNED',
}

export const StatusValues = $enum(Status).map(key => Status[key]);
