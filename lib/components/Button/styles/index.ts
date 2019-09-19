import { rem, lighten, darken } from 'polished';
import styled, { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

const loadingCss = ({ loading }: {loading: number}) => (loading
  ? css`
    pointer-events: none;
  ` : '');

export const StyleButton = styled.button.attrs<
{loading: number; danger: number; text: number},
{background: string; danger: number; text: number; borderColor: string}
>(
  ({
    danger, theme: themes, text,
  }) => ({
    background: (() => {
      if (text) {
        return 'transparent';
      }
      if (danger) {
        return themes.colors.danger;
      }
      return themes.colors.primary;
    })(),
    borderColor: (() => {
      if (text) {
        return 'transparent';
      }
      if (danger) {
        return themes.colors.danger;
      }
      return themes.colors.primary;
    })(),
    color: (() => {
      if (text) {
        if (danger) {
          return themes.colors.danger;
        }
        return themes.colors.primary;
      }
      return '#fff';
    })(),
    danger,
    text,
  }),
)`
  position: relative;
  display: inline-block;
  line-height: ${rem('34px')};
  font-weight: 400;
  border: 1px solid transparent;
  outline: none!important;
  background-image: none;
  cursor: pointer;
  user-select: none;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 ${rem('17px')};
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  border-radius: ${rem('4px')};
  border-color: ${_ => _.borderColor};
  background-color: ${_ => _.background};
  color: ${_ => (_.loading ? _.background : _.color)};
  transition: .2s color ease, .2s background ease;
  ${loadingCss}
  &:disabled {
    cursor: not-allowed;
    opacity: .25;
    pointer-events: none;
  }
  &>svg {
    vertical-align: -${rem(2)};
    margin-right: ${rem(12)};
  }
  &:hover {
    border-color: ${_ => lighten(0.05, _.borderColor)};
    background-color: ${_ => lighten(0.05, _.background)};
  }
  &:active {
    border-color: ${_ => darken(0.05, _.borderColor)};
    background-color: ${_ => darken(0.05, _.background)};
  }
  ${_ => _.text && `
    &:hover {
      color: ${lighten(0.05, _.color!)};
    }
    &:active {
      color: ${darken(0.05, _.color!)};
    }
  `}
`;

export const LoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
