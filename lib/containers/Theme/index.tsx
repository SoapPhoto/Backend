import { inject, observer } from 'mobx-react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ThemeStore } from '@lib/stores/ThemeStore';
import { useIsMobile } from '@lib/common/utils/isMobile';
import { GlobalStyle } from './GlobalStyle';

interface IProps {
  themeStore?: ThemeStore;
}

export const ThemeWrapper = inject('themeStore')(
  observer<React.FC<IProps>>(
    ({ children, themeStore }) => {
      const isMobile = useIsMobile();
      return (
        <ThemeProvider theme={{ ...themeStore!.themeData, isMobile }}>
          <>
            {children}
            <GlobalStyle />
          </>
        </ThemeProvider>
      );
    },
  ),
);
