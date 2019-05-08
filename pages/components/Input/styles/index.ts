import styled from 'styled-components';

export const StyleInput = styled.input`
  line-height: 1;
  width: 100%;
  height: 32px;
  margin: 0;
  padding: 0 10px;
  transition: border .25s ease;
  text-align: left;
  color: #3d444f;
  border: none;
  border-radius: 2px;
  outline: 0;
  background-color: #f7f6f6;
  box-shadow: none;
  & + & {
    margin-top: 12px;
  }
`;
