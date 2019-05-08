import { createGlobalStyle } from 'styled-components';
import normalize from './normalize';
import { nprogress } from './nprogress';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.colors.fontColor};
  }
  ${props => nprogress(props.theme)}
  ${normalize};
`;
