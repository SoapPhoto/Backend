import { rem, lighten, darken } from 'polished';
import styled, { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

const loadingCss = ({ loading }: {loading: number}) => (loading
  ? css`
    pointer-events: none;
  ` : '');

export const StyleButton = styled.button.attrs<
{loading: number; danger: number},
{background: string; danger: number; borderColor: string}
>(
  ({ danger, theme: themes }) => ({
    background: (() => {
      if (danger) {
        return themes.colors.danger;
      }
      return themes.colors.primary;
    })(),
    borderColor: (() => {
      if (danger) {
        return themes.colors.danger;
      }
      return themes.colors.primary;
    })(),
    danger,
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
  color: ${_ => (_.loading ? _.background : '#fff')};
  transition: .2s color ease, .2s background ease;
  ${loadingCss}
  &:disabled {
    cursor: not-allowed;
    opacity: .25;
    pointer-events: none;
  }
  &:hover {
    border-color: ${_ => lighten(0.05, _.borderColor)};
    background-color: ${_ => lighten(0.05, _.background)};
  }
  &:active {
    border-color: ${_ => darken(0.05, _.borderColor)};
    background-color: ${_ => darken(0.05, _.background)};
  }
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
