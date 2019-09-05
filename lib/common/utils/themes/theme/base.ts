import { DefaultTheme } from 'styled-components';

import { darken, lighten, rgba } from 'polished';

const colors = {
  shadowColor: 'rgba(0, 0, 0, 0.06)',
  secondary: '#8a92a9',
  primary: '#05f',
  text: '#161b3d',
  danger: '#ff4d4f',
  background: '#f8fafc',
  gray: '#eaeaea',
  pure: '#fff',
  lightgray: '#fafafa',
  baseGreen: '#47B881',
};

const theme: DefaultTheme = {
  name: 'BASE',
  colors,
  fontSizes: [
    12, 14, 16, 18, 24, 32, 48, 64, 72,
  ],
  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },
  width: {
    wrapper: 1440,
  },
  styles: {
    nprogress: colors.primary,
    box: {
      borderColor: colors.gray,
      background: '#fff',
    },
    link: {
      hover: lighten(0.2, colors.primary),
      active: darken(0.2, colors.primary),
      color: colors.primary,
    },
    input: {
      borderColor: colors.gray,
      background: colors.lightgray,
      shadow: 'transparent',
      disabled: {
        color: colors.gray,
        background: colors.lightgray,
      },
      hover: {
        shadow: rgba(colors.primary, 0.6),
        borderColor: colors.primary,
      },
    },
    collection: {
      background: colors.secondary,
      addPicture: {
        background: colors.text,
        color: colors.pure,
      },
    },
  },
  layout: {
    header: {
      shadowColor: colors.shadowColor,
      borderColor: colors.gray,
      background: '#fff',
      menu: {
        color: colors.secondary,
        hover: {
          color: darken(0.3, colors.secondary),
          background: colors.lightgray,
        },
      },
      logo: colors.primary,
    },
  },
};

export default theme;
