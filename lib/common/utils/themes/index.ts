import { parse } from 'cookie';
import {
  DefaultTheme, ThemedStyledProps, css, keyframes,
} from 'styled-components';
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

export const theme = (path: string) => <P, T>(context: ThemedStyledProps<P, T>): any => (
  _.get(context, `theme.${path}`)
);

export const activate = (scale = 0.96) => `
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

export const skeletonKeyframes = keyframes`
  0% {
    background-position: 200% 50%;
  }

  100% {
    background-position: -200% 50%;
  }
`;

export const skeletonCss = css`
  background: linear-gradient(
    270deg,
    ${theme('styles.skeleton.accents1')},
    ${theme('styles.skeleton.accents2')},
    ${theme('styles.skeleton.accents2')},
    ${theme('styles.skeleton.accents1')}
  );
  background-size: 400% 400%;
  animation: ${skeletonKeyframes} 8s ease-in-out infinite;
`;

export default themeData;
