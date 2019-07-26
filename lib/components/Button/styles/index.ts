import { rem } from 'polished';
import styled, { css } from 'styled-components';

const loadingCss = ({ loading }: {loading: number}) => loading ?
  css`
    pointer-events: none;
  ` : '';

export const StyleButton = styled.button<{loading: number}>`
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
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  border-radius: ${rem('4px')};
  border-color: ${_ => _.loading ? _.theme.colors.gray : _.theme.colors. primary};
  background-color: ${_ => _.loading ? 'rgb(250, 250, 250)' : _.theme.colors.primary};
  color: #fff;
  transition: .2s color ease, .2s background ease;
  ${loadingCss}
  &:disabled {
    cursor: not-allowed;
    opacity: .25;
    pointer-events: none;
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
