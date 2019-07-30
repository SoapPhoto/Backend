import {
  rem, rgba,
} from 'polished';
import styled, { css } from 'styled-components';

export const LabelBox = styled.label`
  position: relative;
  text-align: left;
  display: block;
  font-size: 0;
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

export const inputCss = css<{ error?: boolean; focus?: boolean }>`
  width: 100%;
  line-height: ${rem('28px')};
  margin: 0;
  padding: ${rem('5px')} ${rem('10px')};
  transition: border .25s ease;
  text-align: left;
  color: ${props => rgba(props.theme.colors.text, 0.7)};
  border: none;
  border-radius: ${rem('5px')};
  outline: 0;
  border: 1px solid ;
  background: ${props => props.theme.styles.input.background};
  box-shadow: ${props => props.theme.styles.input.shadow};
  transition: border .2s, color .2s ease-out,box-shadow .2s ease;
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  border-color: ${
  props => (props.error
    ? `${props.theme.colors.danger} !important`
    : props.theme.styles.input.borderColor)
};
  & + & {
    margin-top: ${rem('12px')};
  }
  & textarea {
    line-height: ${rem('28px')};
  }
  ${
  props => (props.focus ? `
      border-color: ${props.theme.styles.input.hover.borderColor};
      box-shadow: 0 1px 4px -1px ${
    props.error
      ? (
        props.theme.styles.input.hover.shadow === 'transparent'
          ? 'transparent'
          : rgba(props.theme.colors.danger, 0.6)
      )
      : props.theme.styles.input.hover.shadow
    };
    ` : '')
}
  &:focus, &:hover {
    border-color: ${props => props.theme.styles.input.hover.borderColor};
    box-shadow: 0 1px 4px -1px ${
  props => (props.error
    ? (
      props.theme.styles.input.hover.shadow === 'transparent'
        ? 'transparent'
        : rgba(props.theme.colors.danger, 0.6)
    )
    : props.theme.styles.input.hover.shadow)
};
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

export const StyleInput = styled.input<{ error: boolean }>`
  ${inputCss}
`;
export const ErrorBox = styled.div`
  position: absolute;
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${_ => _.theme.colors.danger};
  margin-top: ${rem('4px')};
  margin-bottom: ${rem('4px')};
`;
