import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const color = '#fff';
const shadowColor = 'transparent';
const borderColor = '#1e1e1e';
const background = '#121212';
const hoverColor = '#666';

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
    borderColor: 'rgb(51, 51, 51)',
    menu: {
      color: hoverColor,
      hover: {
        color: lighten(.5, hoverColor),
        background: '#111',
      },
    },
    logo: '#e8e8e8',
  },
  link: {
    hover: lighten(.2, hoverColor),
    active: lighten(.2, hoverColor),
    color: hoverColor,
  },
  box: {
    background: '#1e1e1e',
    borderColor: 'rgb(51, 51, 51)',
  },
};

export default theme;
