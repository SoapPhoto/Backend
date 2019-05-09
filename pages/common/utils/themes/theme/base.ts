import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const black = '#000';
const shadowColor = 'rgba(0, 0, 0, 0.06)';
const borderColor = '#eaeaea';

const colors = {
  shadowColor,
  borderColor,
  blue: '#05f',
  fontColor: lighten(.1, black),
};

const theme: DefaultTheme =  {
  colors,
  nprogress: colors.blue,
  header: {
    shadowColor,
    borderColor,
    background: '#fff',
    menu: {
      color: '#555',
    },
    logo: colors.blue,
  },
  href: {
    hover: lighten(.2, colors.blue),
    active: darken(.2, colors.blue),
    color: colors.blue,
  },
  box: {
    borderColor,
    background: '#fff',
  },
  background: '#f8fafc',
};

export default theme;
