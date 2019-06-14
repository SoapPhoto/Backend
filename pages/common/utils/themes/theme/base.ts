import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const colors = {
  shadowColor: 'rgba(0, 0, 0, 0.06)',
  secondary: '#888',
  primary: '#05f',
  text: lighten(.1, '#000'),
  background: '#f8fafc',
  gray: '#eaeaea',
  pure: '#fff',
  lightgray: '#fafafa',
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
    box: {
      borderColor: colors.gray,
      background: '#fff',
    },
    link: {
      hover: lighten(.2, colors.primary),
      active: darken(.2, colors.primary),
      color: colors.primary,
    },
    input: {
      borderColor: 'transparent',
      background: lighten(.48, colors.primary),
      shadow: `0px 1px 1px 0px ${lighten(.4, colors.primary)}`,
      disabled: {
        color: colors.gray,
        background: colors.gray,
      },
      hover: {
        shadow: `0px 1px 2px 0px ${lighten(.3, colors.primary)}`,
        borderColor: 'transparent',
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
          color: darken(.3, colors.secondary),
          background: colors.lightgray,
        },
      },
      logo: colors.primary,
    },
  },
};

export default theme;
