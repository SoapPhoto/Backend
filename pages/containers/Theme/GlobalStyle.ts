import { createGlobalStyle } from 'styled-components';
import normalize from './normalize';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.colors.fontColor};
  }
  ${normalize};
`;
