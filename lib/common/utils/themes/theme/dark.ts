import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const colors = {
  shadowColor: 'transparent',
  text: lighten(0.1, '#fff'),
  primary: '#05f',
  secondary: '#666',
  danger: '#ff4d4f',
  lightgray: 'rgb(51, 51, 51)',
  gray: '#1e1e1e',
  pure: '#000',
  background: '#121212',
  baseGreen: '#47B881',
};

const theme: DefaultTheme = {
  name: 'DARK',
  colors,
  fontSizes: [
    12, 14, 16, 18, 24, 32, 48, 64, 72,
  ],
  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },
  width: {
    wrapper: 2120,
  },
  styles: {
    nprogress: colors.primary,
    link: {
      hover: lighten(0.2, colors.text),
      active: darken(0.2, colors.text),
      color: colors.text,
    },
    box: {
      background: colors.gray,
      borderColor: colors.lightgray,
    },
    input: {
      borderColor: colors.lightgray,
      background: colors.background,
      shadow: 'none',
      disabled: {
        color: colors.gray,
        background: colors.lightgray,
      },
      hover: {
        shadow: 'transparent',
        borderColor: colors.lightgray,
      },
    },
    collection: {
      background: colors.lightgray,
      addPicture: {
        background: colors.background,
        color: '#fff',
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
          color: lighten(0.5, colors.secondary),
          background: '#111',
        },
      },
      logo: '#e8e8e8',
    },
  },
};

export default theme;
