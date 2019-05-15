import { createGlobalStyle } from 'styled-components';
import normalize from './normalize';
import { nprogress } from './nprogress';

export const GlobalStyle = createGlobalStyle<{theme?: any}>`
  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
  ${nprogress}
  ${normalize}
`;
