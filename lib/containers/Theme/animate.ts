import { css } from 'styled-components';
import { timingFunctions } from 'polished';

interface IAnimateInput {
  name: string;
  inStyle: string;
  outStyle: string;
  inTiming?: string;
  outTiming?: string;
}

const animateFunc = ({
  name,
  inStyle,
  outStyle,
  inTiming = 'ease-in',
  outTiming = 'ease-in',
}: IAnimateInput) => css`
  .${name}-enter {
    opacity: 0;
    animation-duration: 0.2s;
    animation-fill-mode: both;
    animation-timing-function: ${inTiming};
    animation-play-state: paused;
  }
  .${name}-appear {
    opacity: 0;
    animation-duration: 0.2s;
    animation-fill-mode: both;
    animation-timing-function: ${outTiming};
    animation-play-state: paused;
  }
  .${name}-leave {
    animation-duration: 0.2s;
    animation-fill-mode: both;
    animation-timing-function: ${inTiming};
    animation-play-state: paused;
  }
  .${name}-enter.${name}-enter-active {
    animation-name: ${name}In;
    animation-play-state: running;
  }
  .${name}-appear.${name}-appear-active {
    animation-name: ${name}In;
    animation-play-state: running;
  }
  .${name}-leave.${name}-leave-active {
    animation-name: ${name}Out;
    animation-play-state: running;
  }
  @keyframes ${name}In {
    ${inStyle}
  }
  @keyframes ${name}Out {
    ${outStyle}
  }
`;

export const animate = css`
  ${
  animateFunc({
    name: 'modalMask',
    inStyle: `
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `,
    outStyle: `
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    `,
    inTiming: timingFunctions('easeInOutSine'),
    outTiming: timingFunctions('easeOutSine'),
  })
}
  ${
  animateFunc({
    name: 'modalContent',
    inStyle: `
      0% {
        opacity: 0;
        transform: scale3d(0.98, 0.98, 0.98);
      }
      100% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    `,
    outStyle: `
      0% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
      100% {
        opacity: 0;
        transform: scale3d(0.98, 0.98, 0.98);
      }
    `,
    inTiming: timingFunctions('easeInOutSine'),
    outTiming: timingFunctions('easeOutSine'),
  })
}
  ${
  animateFunc({
    name: 'popper',
    inStyle: `
      0% {
        opacity: 0;
        transform: scale3d(0.98, 0.98, 0.98);
      }
      100% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    `,
    outStyle: `
      0% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
      100% {
        opacity: 0;
        transform: scale3d(0.98, 0.98, 0.98);
      }
    `,
    inTiming: timingFunctions('easeInOutSine'),
    outTiming: timingFunctions('easeOutSine'),
  })
}
`;
