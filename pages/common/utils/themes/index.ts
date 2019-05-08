import { DefaultTheme } from 'styled-components';

import * as themeData from './theme';

export const getTheme = (theme: string): DefaultTheme => {
  return themeData[theme];
};
