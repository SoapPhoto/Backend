import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { WrapperBox } from '@lib/common/utils/themes/common';
import { Image } from '@lib/components/Image';
import { rem } from 'polished';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';

export const Wrapper = styled.div`
  ${WrapperBox()}
`;

export const List = styled(Grid)`
  ${customMedia.lessThan('medium')`
    grid-template-columns: repeat(1,1fr);
  `}

  /* ${customMedia.between('small', 'medium')`
    grid-template-columns: repeat(2,1fr);
  `} */

  ${customMedia.between('medium', 'large')`
    grid-template-columns: repeat(3,1fr);
  `}

  ${customMedia.greaterThan('large')`
    grid-template-columns: repeat(4,1fr);
  `}
  grid-gap: 24px;
`;

export const Collection = styled.div``;

export const ItemBox = styled(Grid)`
  grid-template-columns: 2fr 1fr;
  border-radius: 4px;
  overflow: hidden;
`;

export const Preview = styled.div`
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
`;

export const MorePreview = styled.div``;

export const Img = styled(Image)`
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const ItemInfo = styled.div`
  margin-top: ${rem('8px')};
`;

export const Title = styled(A)`
  color: ${theme('colors.text')};
  text-decoration: none;
  font-weight: 600;
  font-size: ${_ => rem(_.theme.fontSizes[2])};
`;

export const PictureCount = styled.p`
  color: ${theme('colors.secondary')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
`;
