import {
  SettingTypeValues, UserTypeValues, PictureTypeValues, CollectionTypeValues, OauthTypeValues,
} from '@common/enum/router';

export const routeObject: Record<string, string> = {
  '/': 'views/home',
  '/login': 'views/auth/login',
  '/signup': 'views/auth/signup',
  '/validatoremail': 'views/auth/validatoremail',
  '/upload': 'views/upload',
  '/tag/:name': 'views/tag',
  '/authenticate': 'views/auth/authenticate',
  '/signupMessage': 'views/auth/signupMessage',
  '/auth/verify': 'views/auth/verify',
  [`/picture/:id([0-9]+)/:type(${PictureTypeValues.join('|')})?`]: 'views/picture',
  [`/setting/:type(${SettingTypeValues.join('|')})`]: 'views/setting',
  [`/@:username/:type(${UserTypeValues.join('|')})?`]: 'views/user',
  [`/collection/:id/:type(${CollectionTypeValues.join('|')})?`]: 'views/collection',
  [`/redirect/oauth/:type(${OauthTypeValues.join('|')})?`]: 'views/auth/oauth',
};
