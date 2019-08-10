import styled from 'styled-components';
import { Grid } from 'styled-css-grid';
import media from 'styled-media-query';

import { WrapperBox } from '@lib/common/utils/themes/common';
import { Image } from '@lib/components/Image';
import { rem } from 'polished';
import { A } from '@lib/components/A';

export const Wrapper = styled(Grid)`
  ${WrapperBox()}
  ${media.lessThan('small')`
    grid-template-columns: repeat(1,1fr);
  `}

  ${media.between('small', 'medium')`
    grid-template-columns: repeat(2,1fr);
  `}

  ${media.between('medium', 'large')`
    grid-template-columns: repeat(3,1fr);
  `}

  ${media.greaterThan('large')`
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
  object-fit: cover;
`;

export const ItemInfo = styled.div`
  margin-top: ${rem('8px')};
`;

export const Title = styled(A)`
  color: ${_ => _.theme.colors.text};
  text-decoration: none;
  font-weight: 600;
`;

export const PictureCount = styled.p`
  color: ${_ => _.theme.colors.secondary};
  font-size: ${_ => _.theme.fontSizes[0]}px;
`;
