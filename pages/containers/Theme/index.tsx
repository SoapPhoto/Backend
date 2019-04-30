import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';

export const ThemeWrapper: React.SFC = ({ children }) => (
  <ThemeProvider theme={{}}>
    <React.Fragment>
      <div>{children}</div>
      <GlobalStyle />
    </React.Fragment>
  </ThemeProvider>
);
