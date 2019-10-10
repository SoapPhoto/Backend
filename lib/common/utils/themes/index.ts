import { parse } from 'cookie';
import { DefaultTheme, ThemedStyledProps, css } from 'styled-components';
import _ from 'lodash';

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

export const theme = (path: string) => <P, T>(context: ThemedStyledProps<P, T>): string => (
  _.get(context, `theme.${path}`)
);

export const activte = (scale = 0.96) => `
  transition: transform 0.1s;
  &:active {
    transform: scale(${scale});
  }
`;

export const initButton = css`
  cursor: pointer;
  outline: none;
  border: none;
`;

export default themeData;
