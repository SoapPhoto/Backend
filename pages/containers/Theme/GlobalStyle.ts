import { createGlobalStyle } from 'styled-components';
import normalize from './normalize';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f8fafc;
  }
  ${normalize};
`;
