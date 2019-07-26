import { createGlobalStyle } from 'styled-components';
import normalize from './normalize';
import { nprogress } from './nprogress';

export const GlobalStyle = createGlobalStyle<{theme?: any}>`
  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 300ms;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 300ms;
  }
  .fade-done-enter {
    opacity: 1 !important;
  }

  ${nprogress}
  ${normalize}
`;
