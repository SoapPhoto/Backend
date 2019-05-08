import { DefaultTheme } from 'styled-components';

import { darken, lighten } from 'polished';

const black = '#000';

const colors = {
  blue: '#3a52fe',
  fontColor: lighten(.1, black),
};

const theme: DefaultTheme =  {
  colors,
  header: {
    background: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    borderColor: 'rgb(238, 238, 238)',
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
  background: '#f8fafc',
};

export default theme;
