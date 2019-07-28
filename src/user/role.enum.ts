export enum Role  {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const RoleValues = Object.keys(Role).map((key: any) => Role[key]);
