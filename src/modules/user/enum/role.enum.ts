export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OWNER = 'OWNER',
}

export const RoleValues = Object.keys(Role).map((key: any) => Role[key]);
