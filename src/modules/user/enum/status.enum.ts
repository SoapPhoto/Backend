export enum Status {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export const StatusValues = Object.keys(Status).map((key: any) => Status[key]);
