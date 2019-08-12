import { $enum } from "ts-enum-util";

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OWNER = 'OWNER',
}

export const RoleValues = $enum(Role).map(key => Role[key]);
