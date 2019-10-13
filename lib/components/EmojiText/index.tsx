import React from 'react';
import { Props, Twemoji } from 'react-emoji-render';
import styled from 'styled-components';

const StyledEmoji = styled(Twemoji)`
  img {
    width: 1.3em !important;
    height: 1.3em !important;
    vertical-align: -0.15em !important;
  }
`;

export const EmojiText: React.FC<Props> = ({
  svg = true,
  ...props
}) => (
  <StyledEmoji
    svg={svg}
    onlyEmojiClassName="emoji-text"
    {...props}
  />
);
