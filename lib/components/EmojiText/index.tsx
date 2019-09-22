import React from 'react';
import { Props, Twemoji } from 'react-emoji-render';

export const EmojiText: React.FC<Props> = ({
  svg = true,
  ...props
}) => (
  <Twemoji
    svg={svg}
    {...props}
  />
);
