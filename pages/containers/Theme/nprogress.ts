import { rem } from 'polished';
import { css, DefaultTheme, ThemedStyledProps } from 'styled-components';

export const nprogress = (props: ThemedStyledProps<{}, DefaultTheme>) => css`
  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background: ${props.theme.styles.nprogress};

    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;

    width: 100%;
    height: ${rem('2px')};
  }

  /* Fancy blur effect */
  #nprogress .peg {
    display: block;
    position: absolute;
    right: ${rem('0px')};
    width: ${rem('100px')};
    height: 100%;
    box-shadow: 0 0 10px ${props.theme.styles.nprogress}, 0 0 5px ${props.theme.styles.nprogress};
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }

  /* Remove these to get rid of the spinner */
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 1031;
    top: ${rem('15px')};
    right: ${rem('15px')};
  }

  #nprogress .spinner-icon {
    width: ${rem('18px')};
    height: ${rem('18px')};
    box-sizing: border-box;

    border: solid 2px transparent;
    border-top-color: ${props.theme.styles.nprogress};
    border-left-color: ${props.theme.styles.nprogress};
    border-radius: 50%;
    animation: nprogress-spinner 400ms linear infinite;
  }

  .nprogress-custom-parent {
    overflow: hidden;
    position: relative;
  }

  .nprogress-custom-parent #nprogress .spinner,
  .nprogress-custom-parent #nprogress .bar {
    position: absolute;
  }

  @-webkit-keyframes nprogress-spinner {
    0%   { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

`;
