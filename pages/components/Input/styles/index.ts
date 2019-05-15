import { darken } from 'polished';
import styled from 'styled-components';

export const LabelBox = styled.label`
  text-align: left;
  display: block;
`;
export const Label = styled.span`
  display: inline-block;
  font-size: ${_ => _.theme.fontSizes[0]}px;
  margin-bottom: 8px;
  color: ${_ => _.theme.colors.secondary};
`;

export const StyleInput = styled.input`
  line-height: 1;
  width: 100%;
  height: 38px;
  margin: 0;
  padding: 0 10px;
  transition: border .25s ease;
  text-align: left;
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 5px;
  outline: 0;
  border: 1px solid ${props => props.theme.colors.gray};
  background: ${props => props.theme.colors.background};
  box-shadow: none;
  transition: border .2s,color .2s ease-out,box-shadow .2s ease;
  & + & {
    margin-top: 12px;
  }
  &:hover {
    border-color: ${_ => _.theme.styles.input.borderColor};
    box-shadow: ${_ => _.theme.styles.input.shadow};
  }
  &:focus {
    border-color: ${_ => _.theme.styles.input.borderColor};
    box-shadow: ${_ => _.theme.styles.input.shadow};
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
