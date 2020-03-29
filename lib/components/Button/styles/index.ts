import { rem, lighten, darken } from 'polished';
import styled, { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

const loadingCss = ({ loading }: { loading: number }) => (loading
  ? css`
    pointer-events: none;
  ` : '');

interface IBtnIProp {
  loading: number;
  danger: number;
  text: number;
  size: string;
  shape: string;
}
interface IBtnAttr {
  background: string;
  danger: number;
  text: number;
  borderColor: string;
  size: string;
  shape: string;
  height: number;
}


export const StyleButton = styled.button.attrs<IBtnIProp, IBtnAttr>(
  ({
    danger, theme: themes, text, size, shape,
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
    height: (() => {
      if (size === 'small') {
        return 24;
      } if (size === 'large') {
        return 40;
      }
      return 34;
    })(),
    danger,
    text,
    size,
    shape,
  }),
)`
  position: relative;
  display: inline-block;
  line-height: ${_ => rem(_.height + 2)};
  font-weight: 400;
  border: 0px solid transparent;
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
  ${_ => (_.text ? `
    &:hover {
      color: ${lighten(0.05, _.color!)};
    }
    &:active {
      color: ${darken(0.05, _.color!)};
    }
  ` : '')}
  ${_ => _.size === 'small' && css`
    padding: 0 ${rem(12)};
    font-size: ${test => rem(theme('fontSizes[30]')(test))};
  `}
  ${_ => _.size === 'large' && css`
    padding: 0 ${rem(15)};
  `}
  ${_ => _.shape === 'circle' && css`
    border-radius: 50%;
    width: ${rem(_.height)};
    height: ${rem(_.height)};
    padding: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &>svg {
      margin-right: 0;
    }
  `}
  ${_ => _.shape === 'round' && css`
    border-radius: 50%;
    border-radius: ${rem(_.height)};
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
