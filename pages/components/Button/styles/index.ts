import styled, { css, keyframes } from 'styled-components';

const animate = keyframes`
  0%{
    opacity:0.2;
  }
  20%{
    opacity:1;
  }
  100%{
    opacity:0.2;
  }
`;

const loadingCss = ({ loading }: {loading: boolean}) => loading ?
  css`
    pointer-events: none;
  ` : '';

export const StyleButton = styled.button<{loading: boolean}>`
  position: relative;
  display: inline-block;
  height: 34px;
  line-height: 34px;
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
  padding: 0 17px;
  font-size: ${_ => _.theme.fontSizes[1]}px;
  border-radius: 4px;
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

export const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  & span {
    animation-name: ${animate};
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    width: 4px;
    height: 4px;
    background-color: rgb(68, 68, 68);
    display: inline-block;
    border-radius: 50%;
    margin: 0px 2px;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;
