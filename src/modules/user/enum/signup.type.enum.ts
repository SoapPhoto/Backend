import { $enum } from 'ts-enum-util';

export enum SignupType {
  EMAIL = 'EMAIL',
}

export const SignupTypeValues = $enum(SignupType).map(key => SignupType[key]);
