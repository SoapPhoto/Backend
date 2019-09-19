import {
  SettingTypeValues, UserTypeValues, PictureTypeValues, CollectionTypeValues, OauthTypeValues,
} from '@common/enum/router';

export const routeObject: Record<string, string> = {
  '/': 'views/home',
  '/login': 'views/auth/login',
  '/signup': 'views/auth/signup',
  '/validatoremail': 'views/auth/validatoremail',
  '/upload': 'views/upload',
  [`/picture/:id([0-9]+)/:type(${PictureTypeValues.join('|')})?`]: 'views/picture',
  [`/setting/:type(${SettingTypeValues.join('|')})`]: 'views/setting',
  [`/@:username/:type(${UserTypeValues.join('|')})?`]: 'views/user',
  '/tag/:name': 'views/tag',
  [`/collection/:id/:type(${CollectionTypeValues.join('|')})?`]: 'views/collection',
  '/authenticate': 'views/auth/authenticate',
  [`/redirect/oauth/:type(${OauthTypeValues.join('|')})?`]: 'views/auth/oauth',
};
