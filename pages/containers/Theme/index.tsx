import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { ThemeStore } from '@pages/stores/ThemeStore';
import { GlobalStyle } from './GlobalStyle';

interface IProps {
  themeStore?: ThemeStore;
}

export const ThemeWrapper = inject('themeStore')(
  observer<React.SFC<IProps>>(
    ({ children, themeStore }) => (
      <ThemeProvider theme={themeStore!.themeData}>
        <React.Fragment>
          <div>{children}</div>
          <GlobalStyle />
        </React.Fragment>
      </ThemeProvider>
    ),
  ),
);
