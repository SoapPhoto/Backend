import React from 'react';

import { CollectionEntity } from '@lib/common/interfaces/collection';
import { getPictureUrl } from '@lib/common/utils/image';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { A } from '@lib/components/A';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { Lock } from '@lib/icon';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { rem } from 'polished';
import { Popover } from '@lib/components/Popover';
import { useTranslation } from '@lib/i18n/useTranslation';
import {
  ItemBox, Preview, MorePreview, Img, Collection, ItemInfo, Title, PictureCount,
} from './styles';

interface IProps {
  info: CollectionEntity;
  themeStore?: ThemeStore;
}

export const CollectionItem: React.FC<IProps> = ({
  info,
}) => {
  const { styles, colors } = useTheme();
  const { t } = useTranslation();
  const { preview, name, pictureCount } = info;
  const one = preview[0];
  const two = preview[1];
  const three = preview[2];
  const color = (currentColor?: PictureEntity) => (currentColor ? currentColor.color : styles.collection.background);
  return (
    <Collection>
      <A route={`/collection/${info.id}`}>
        <ItemBox gap="2">
          <Preview
            style={{ backgroundColor: color(one), marginRight: 3 }}
          >
            {
              one && <Img src={getPictureUrl(one.key, 'regular')} />
            }
          </Preview>
          <MorePreview>
            <Preview style={{ backgroundColor: color(two), marginBottom: 3 }}>
              {
                two && <Img src={getPictureUrl(two.key, 'regular')} />
              }
            </Preview>
            <Preview style={{ backgroundColor: color(three) }}>
              {
                three && <Img src={getPictureUrl(three.key, 'regular')} />
              }
            </Preview>
          </MorePreview>
        </ItemBox>
      </A>
      <ItemInfo>
        <Title route={`/collection/${info.id}`}>
          {
            info.isPrivate && (
              <Popover
                trigger="hover"
                placement="top"
                theme="dark"
                openDelay={100}
                content={<span>{t('private_xx', t('collection'))}</span>}
              >
                <Lock
                  style={{
                    strokeWidth: 3,
                    marginRight: rem(6),
                    marginBottom: rem(-1),
                  }}
                  size={16}
                  color={colors.secondary}
                />
              </Popover>
            )
          }
          {name}
        </Title>
        <PictureCount>
          {t('img_count', pictureCount.toString())}
        </PictureCount>
      </ItemInfo>
    </Collection>
  );
};
