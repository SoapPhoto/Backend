import { $enum } from 'ts-enum-util';

export enum SignupType {
  EMAIL = 'EMAIL',
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
}

export const SignupTypeValues = $enum(SignupType).map(key => SignupType[key]);
