import { darken } from 'polished';
import styled from 'styled-components';

export const StyleInput = styled.input`
  line-height: 1;
  width: 100%;
  height: 38px;
  margin: 0;
  padding: 0 10px;
  transition: border .25s ease;
  text-align: left;
  color: ${props => props.theme.colors.fontColor};
  border: none;
  border-radius: 5px;
  outline: 0;
  border: 1px solid ${props => props.theme.colors.borderColor};
  background: ${props => props.theme.background};
  box-shadow: none;
  transition: border .2s,color .2s ease-out,box-shadow .2s ease;
  & + & {
    margin-top: 12px;
  }
  &:hover {
    border-color: #ddd;
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
  }
  &:focus {
    border-color: #ddd;
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
  }
  &::placeholder {
    /* color: ${props => darken(.4, props.theme.colors.fontColor)}; */
  }
`;
