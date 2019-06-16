import { lighten, opacify, rem, rgba } from 'polished';
import styled from 'styled-components';

export const LabelBox = styled.label`
  position: relative;
  text-align: left;
  display: block;
`;
export const Label = styled.span`
  display: inline-block;
  font-weight: 500;
  line-height: ${rem('29px')};
  letter-spacing: 0.61px;
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  margin-bottom: ${rem('8px')};
  color: ${_ => _.theme.colors.secondary};
`;

export const StyleInput = styled.input<{ error: boolean }>`
  line-height: 1;
  width: 100%;
  height: ${rem('40px')};
  margin: 0;
  padding: ${rem('5px')} ${rem('10px')};
  transition: border .25s ease;
  text-align: left;
  color: ${props => rgba(props.theme.colors.text, .7)};
  border: none;
  border-radius: ${rem('5px')};
  outline: 0;
  border: 1px solid ;
  background: ${props => props.theme.styles.input.background};
  box-shadow: ${props => props.theme.styles.input.shadow};
  transition: border .2s,color .2s ease-out,box-shadow .2s ease;
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  border-color: ${
  props => props.error ?
    `${props.theme.colors.danger} !important` :
    props.theme.styles.input.borderColor
  };
  & + & {
    margin-top: ${rem('12px')};
  }
  &:focus, &:hover {
    border-color: ${props => props.theme.styles.input.hover.borderColor};
    box-shadow: ${props => props.theme.styles.input.hover.shadow};
  }
  &::placeholder {
  }
  &[disabled] {
    background-color: ${_ => _.theme.styles.input.disabled.background};
    cursor: not-allowed;
    opacity: 1;
    &:hover {
      border-color: #ddd;
      box-shadow: none;
    }
    &:focus {
      border-color: #ddd;
      box-shadow: none;
    }
  }
`;

export const ErrorBox = styled.div`
  position: absolute;
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${_ => _.theme.colors.danger};
  margin-top: ${rem('4px')};
  margin-bottom: ${rem('4px')};
`;
