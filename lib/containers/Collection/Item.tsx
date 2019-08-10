import React from 'react';

import { CollectionEntity } from '@lib/common/interfaces/collection';
import { getPictureUrl } from '@lib/common/utils/image';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { A } from '@lib/components/A';
import {
  ItemBox, Preview, MorePreview, Img, Collection, ItemInfo, Title, PictureCount,
} from './styles';

interface IProps {
  info: CollectionEntity;
}

export const CollectionItem: React.FC<IProps> = ({
  info,
}) => {
  const { preview, name, pictureCount } = info;
  const one = preview[0];
  const two = preview[1];
  const three = preview[2];
  const colors = (color?: PictureEntity) => (color ? color.color : '#ccc');
  return (
    <Collection>
      <A route={`/collection/${info.id}`}>
        <ItemBox gap="2">
          <Preview
            style={{ backgroundColor: colors(one), marginRight: 3 }}
          >
            {
              one && <Img src={getPictureUrl(one.key, 'regular')} />
            }
          </Preview>
          <MorePreview>
            <Preview style={{ backgroundColor: colors(two), marginBottom: 3 }}>
              {
                two && <Img src={getPictureUrl(two.key, 'regular')} />
              }
            </Preview>
            <Preview style={{ backgroundColor: colors(three) }}>
              {
                three && <Img src={getPictureUrl(three.key, 'regular')} />
              }
            </Preview>
          </MorePreview>
        </ItemBox>
      </A>
      <ItemInfo>
        <Title route={`/collection/${info.id}`}>
          {name}
        </Title>
        <PictureCount>
          <span>{pictureCount}</span>
          <span>张照片</span>
        </PictureCount>
      </ItemInfo>
    </Collection>
  );
};
