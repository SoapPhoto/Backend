import { DefaultTheme } from 'styled-components';

import * as themeData from './theme';

export type ThemeType = keyof typeof themeData;

export const getTheme = (theme: ThemeType): DefaultTheme => {
  return themeData[theme];
};
