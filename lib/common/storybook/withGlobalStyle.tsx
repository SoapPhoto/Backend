import React from 'react';
import { GlobalStyle } from '@lib/containers/Theme/GlobalStyle';

export const withGlobalStyle = (story: any) => (
  <>
    <GlobalStyle />
    {story()}
  </>
);
