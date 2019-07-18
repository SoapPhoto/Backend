import { darken, lighten, rem } from 'polished';
import { DefaultTheme } from 'styled-components';

export const href = (color: string, hover?: string, active?: string) => `
  text-decoration:none;
  color: ${color};
  transition: .2s color ease-in;
  &:hover {
    color: ${hover ? hover : lighten(.1, color)};
  }
  &:active {
    color: ${active ? active : darken(.1, color)};
  }
`;

export const box = (theme: DefaultTheme, width: string, wrapper = false) => `
  width: 100%;
  max-width: ${width};
  border-radius: ${rem('4px')};
  background-color: ${theme.styles.box.background};
  box-shadow: ${theme.colors.shadowColor} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  border: 1px solid ${theme.styles.box.borderColor};
  ${wrapper ? 'margin: 0 auto' : ''}
  padding: ${rem('32px')};
  overflow: hidden;
`;
