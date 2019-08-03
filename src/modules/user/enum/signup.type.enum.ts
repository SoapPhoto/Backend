export enum SignupType {
  EMAIL = 'EMAIL',
}

export const SignupTypeValues = Object.keys(SignupType).map((key: any) => SignupType[key]);
