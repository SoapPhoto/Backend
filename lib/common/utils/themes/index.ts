import { parse } from 'cookie';
import { DefaultTheme } from 'styled-components';

import * as themeData from './theme';

export type ThemeType = keyof typeof themeData;

export const getTheme = (theme: ThemeType): DefaultTheme => themeData[theme];

export const getCurrentTheme = (data?: any) => {
  let cookies: {[key: string]: string} = data;
  if (typeof data === 'string') {
    cookies = parse(data);
  }
  return cookies.theme;
};

export default themeData;
