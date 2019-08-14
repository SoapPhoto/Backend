import { $enum } from 'ts-enum-util';

export enum Status {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export const StatusValues = $enum(Status).map((key: any) => Status[key]);
