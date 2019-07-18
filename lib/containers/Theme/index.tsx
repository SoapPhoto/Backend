import { inject, observer } from 'mobx-react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ThemeStore } from '@lib/stores/ThemeStore';
import { GlobalStyle } from './GlobalStyle';

interface IProps {
  themeStore?: ThemeStore;
}

export const ThemeWrapper = inject('themeStore')(
  observer<React.FC<IProps>>(
    ({ children, themeStore }) => (
      <ThemeProvider theme={themeStore!.themeData}>
        <React.Fragment>
          {children}
          <GlobalStyle />
        </React.Fragment>
      </ThemeProvider>
    ),
  ),
);
