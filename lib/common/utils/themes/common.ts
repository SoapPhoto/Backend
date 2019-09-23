import { darken, lighten, rem } from 'polished';
import { DefaultTheme, css } from 'styled-components';
import { theme as themeData } from './index';

export const href = (color: string, hover?: string, active?: string) => `
  text-decoration:none;
  color: ${color};
  transition: .2s color ease-in;
  &:hover {
    color: ${hover || lighten(0.1, color)};
  }
  &:active {
    color: ${active || darken(0.1, color)};
  }
`;

export const box = (theme: DefaultTheme, width: string, wrapper = false) => `
  width: 100%;
  max-width: ${width};
  border-radius: ${rem('4px')};
  background-color: ${theme.styles.box.background};
  box-shadow: ${theme.colors.shadowColor} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  border: 1px solid ${theme.styles.box.borderColor};
  ${wrapper ? 'margin: 0 auto;' : ''}
  padding: ${rem('32px')};
  overflow: hidden;
`;

export const WrapperBox = (width?: number) => css`
  width: 100%;
  max-width: ${_ => rem(width || themeData('width.wrapper')(_))};
  margin: ${rem('32px')} auto;
  padding: 0 ${rem('32px')};
`;
