import React from 'react';
import { GlobalStyle } from '@lib/containers/Theme/GlobalStyle';
import { RenderFunction } from '@storybook/react';

export const withGlobalStyle = (story: RenderFunction) => (
  <>
    <GlobalStyle />
    {story()}
  </>
);
