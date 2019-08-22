import { SettingTypeValues, UserTypeValues } from '@common/enum/router';

export const routeObject: Record<string, string> = {
  '/': 'views/home',
  '/login': 'views/auth/login',
  '/validatoremail': 'views/auth/validatoremail',
  '/upload': 'views/upload',
  '/picture/:id([0-9]+)': 'views/picture',
  [`/setting/:type(${SettingTypeValues.join('|')})`]: 'views/setting',
  [`/@:username/:type(${UserTypeValues.join('|')})?`]: 'views/user',
  '/tag/:name': 'views/tag',
  '/collection/:id': 'views/collection',
};