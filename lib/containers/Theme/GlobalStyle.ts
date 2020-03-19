import { createGlobalStyle } from 'styled-components';

import { theme } from '@lib/common/utils/themes';
import normalize from './normalize';
import { nprogress } from './nprogress';
import { scroll } from './scroll';
import { scrollbar } from './scrollbar';
import { animate } from './animate';

export const GlobalStyle = createGlobalStyle<{theme?: any}>`
  body {
    background-color: ${theme('colors.background')};
    color: ${theme('colors.text')};
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

  .tangram-suggestion-main {
    z-index: 1000000000000000000;
  }

  .none {
    display: none;
  }

  ${nprogress}
  ${normalize}
  ${scroll}
  ${scrollbar}
  ${animate}
`;
