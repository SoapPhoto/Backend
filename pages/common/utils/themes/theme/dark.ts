import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const color = '#fff';
const shadowColor = 'transparent';
const borderColor = '#1e1e1e';
const background = '#121212';

const colors = {
  shadowColor,
  borderColor,
  blue: '#05f',
  fontColor: lighten(.1, color),
};

const theme: DefaultTheme =  {
  colors,
  background,
  nprogress: colors.blue,
  header: {
    background: '#1e1e1e',
    shadowColor: 'transparent',
    borderColor: 'transparent',
    menu: {
      color: '#555',
    },
    logo: '#e8e8e8',
  },
  href: {
    hover: lighten(.2, '#fff'),
    active: darken(.2, '#fff'),
    color: '#fff',
  },
  box: {
    background: '#1e1e1e',
  },
};

export default theme;
