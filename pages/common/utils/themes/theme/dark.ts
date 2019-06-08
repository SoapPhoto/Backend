import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const colors = {
  shadowColor: 'transparent',
  text: lighten(.1, '#fff'),
  primary: '#05f',
  secondary: '#666',
  lightgray: 'rgb(51, 51, 51)',
  gray: '#1e1e1e',
  pure: '#000',
  background: '#121212',
};

const theme: DefaultTheme =  {
  colors,
  fontSizes: [
    12, 14, 16, 18, 24, 32, 48, 64, 72,
  ],
  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },
  styles: {
    nprogress: colors.primary,
    link: {
      hover: lighten(.2, colors.text),
      active: darken(.2, colors.text),
      color: colors.text,
    },
    box: {
      background: colors.gray,
      borderColor: colors.lightgray,
    },
    input: {
      borderColor: colors.lightgray,
      shadow: `0 2px 6px ${colors.shadowColor}`,
      disabled: {
        color: colors.gray,
        background: colors.lightgray,
      },
    },
  },
  layout: {
    header: {
      background: colors.gray,
      shadowColor: 'transparent',
      borderColor: colors.lightgray,
      menu: {
        color: colors.secondary,
        hover: {
          color: lighten(.5, colors.secondary),
          background: '#111',
        },
      },
      logo: '#e8e8e8',
    },
  },
};

export default theme;
