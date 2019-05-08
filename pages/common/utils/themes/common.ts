import { darken, lighten } from 'polished';

export const href = (color: string, hover?: string, active?: string) => `
  text-decoration:none;
  color: ${color};
  transition: .2s color ease-in;
  &:hover {
    color: ${hover ? hover : lighten(.1, color)};
  }
  &:active {
    color: ${active ? active : darken(.1, color)};
  }
`;
