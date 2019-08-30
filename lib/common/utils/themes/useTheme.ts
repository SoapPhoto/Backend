import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const useTheme = () => {
  const data = useContext(ThemeContext);

  return data;
};
