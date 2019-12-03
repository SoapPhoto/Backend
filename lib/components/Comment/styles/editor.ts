import { rem } from 'polished';
import styled from 'styled-components';
import { customMedia } from '@lib/common/utils/mediaQuery';

export const Wrapper = styled.div`
  display: flex;
  padding-bottom: ${rem(12)};
  margin-bottom: ${rem(12)};
`;

export const Box = styled.div`
  flex: 1;
`;

export const AvatarBox = styled.div`
  ${customMedia.lessThan('mobile')`
    display: none;
  `}
`;

export const HandleBox = styled.div`
  display: flex;
  height: ${rem('36px')};
  margin-top: -${rem('48px')};
  padding: 0 ${rem('12px')};
  justify-content: space-between;
`;
