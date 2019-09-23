import { generateMedia } from 'styled-media-query';

export const customBreakpoints = {
  huge: '1440px',
  large: '1170px',
  medium: '868px',
  mobile: '604px',
  small: '450px',
};

export const customMedia = generateMedia(customBreakpoints);
