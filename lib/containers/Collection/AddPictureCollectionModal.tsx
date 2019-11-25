/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { rgba, rem } from 'polished';
import styled from 'styled-components';

import { Modal, EmojiText, Empty } from '@lib/components';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { CollectionEntity } from '@lib/common/interfaces/collection';
import {
  Check, Minus, PlusCircle, Lock,
} from '@lib/icon';
// import { removePictureCollection, addPictureCollection } from '@lib/services/collection';
import { Loading } from '@lib/components/Loading';
import { Image } from '@lib/components/Image';
import { theme, activate } from '@lib/common/utils/themes';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useStores } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { observer } from 'mobx-react';
import { Popover } from '@lib/components/Popover';
import { RemovePictureCollection, AddPictureCollection } from '@lib/schemas/mutations';
import { AddCollectionModal } from './AddCollectionModal';

interface IProps {
  visible: boolean;
  picture: PictureEntity;
  onClose: () => void;
  currentCollections: CollectionEntity[];
  setPicture?: (picture: Partial<PictureEntity>) => void;
}

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  padding: ${rem('24px')};
`;

const CheckIcon = styled(Check)`
  transition: .1s opacity ease;
`;
const MinusIcon = styled(Minus)`
  transition: .1s opacity ease;
`;

const CollectionItemBox = styled.button`
  cursor: pointer;
  outline: none;
  display: block;
  width: 100%;
  height: ${rem('80px')};
  border-radius: 5px;
  background-color: #f5f5f5;
  overflow: hidden;
  border: none;
  padding: 0;
  background-color: transparent;
  position: relative;
  text-align: inherit;
  transition: transform 0.1s;
  ${activate()}
`;

const CollectionBox = styled.div`
  padding: ${rem(24)};
  padding-top: 0;
  display: grid;
  grid-gap: 14px;
`;

const CollectionItemCover = styled(Image)`
  font-family: "object-fit:cover";
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const ItemInfoBox = styled.div<{isCollected: boolean; isPreview: boolean}>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: ${_ => rgba(theme('styles.collection.addPicture.background')(_), _.isPreview ? 0.6 : 0.8)};
  transition: all .15s ease-in-out;
  padding: 17px 20px;
  color: ${theme('styles.collection.addPicture.color')};
  border-radius: 4px;
  & ${CheckIcon} {
    opacity: 0;
  }
  & ${MinusIcon} {
    opacity: 0;
  }
  &:hover {
    & ${CheckIcon} {
      opacity: 1;
    }
  }
  ${
  _ => _.isCollected && `
      border: 2px solid ${_.theme.colors.baseGreen};
      background: linear-gradient(
        45deg,
        ${rgba(theme('styles.collection.addPicture.background')(_), 0.3)},
        ${_.theme.colors.baseGreen}
      );
      & ${CheckIcon} {
        opacity: 1;
      }
      &:hover {
        & ${MinusIcon} {
          opacity: 1;
        }
        & ${CheckIcon} {
          opacity: 0;
        }
      }
    `}
`;

const ItemInfoTitle = styled.p`
  color: ${theme('styles.collection.addPicture.color')};
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  font-weight: 700;
  margin-bottom: ${rem(6)};
  display: flex;
  align-items: center;
`;

const ItemInfoCount = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
`;

const ItemHandleIcon = styled.div`
  position: relative;
  & svg:first-child {
    position: absolute;
  }
`;

export const AddPictureCollectionModal: React.FC<IProps> = observer(({
  visible,
  picture,
  onClose,
  currentCollections,
  setPicture,
}) => {
  const { t } = useTranslation();
  const { key, id } = picture;
  const { appStore } = useStores();
  const {
    addCollection, getCollection, userCollection, collectionLoading,
  } = appStore;
  const { colors } = useTheme();
  const client = useApolloClient();
  const [addCollectionVisible, setAddCollectionVisible] = useState(false);
  const [loadingObj, setLoading] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState<Map<string, CollectionEntity>>(new Map());
  // eslint-disable-next-line max-len
  const background = `linear-gradient(${rgba(colors.gray, 0.8)}, ${colors.gray} 200px), url("${getPictureUrl(key, 'blur')}")`;
  useEffect(() => () => setAddCollectionVisible(false), []);
  useEffect(() => {
    if (!visible) {
      setAddCollectionVisible(false);
    } else {
      getCollection();
      setCurrent(
        new Map(currentCollections.map(collection => [collection.id, collection])),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  useEffect(() => {
    const obj: Record<string, boolean> = {};
    userCollection.forEach(collection => obj[collection.id] = false);
    setLoading(obj);
  }, [userCollection]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCollected = async (collection: CollectionEntity, isCollected: boolean) => {
    if (loadingObj[collection.id]) {
      return;
    }
    setLoading(ld => ({
      ...ld,
      [collection.id]: true,
    }));
    try {
      if (isCollected) {
        await client.mutate({
          mutation: RemovePictureCollection,
          variables: {
            id: collection.id,
            pictureId: id,
          },
        });
        current.delete(collection.id);
        setCurrent(current);
        if (setPicture) {
          if (current.size === 0) {
            setPicture({ currentCollections: [] });
          } else {
            setPicture({ currentCollections: currentCollections.filter(v => v.id !== collection.id) });
          }
        }
      } else {
        const { data } = await client.mutate<{addPictureCollection: CollectionEntity}>({
          mutation: AddPictureCollection,
          variables: {
            id: collection.id,
            pictureId: id,
          },
        });
        if (data && setPicture) {
          setPicture({ currentCollections: [...currentCollections, data.addPictureCollection] });
        }
        setCurrent(current.set(collection.id, collection));
      }
      getCollection();
    } finally {
      setLoading(ld => ({
        ...ld,
        [collection.id]: false,
      }));
    }
  };
  const onAddCollectionOk = (data: CollectionEntity) => {
    addCollection(data);
    setAddCollectionVisible(false);
  };
  let content = [<Empty key="loading" loading />];
  if (!collectionLoading) {
    content = userCollection.map((collection) => {
      const isCollected = current.has(collection.id);
      const isLoading = loadingObj[collection.id];
      const preview = collection.preview.slice();
      return (
        <CollectionItemBox
          key={collection.id}
          onClick={() => !isLoading && onCollected(collection, isCollected)}
        >
          {
            preview[0] && (
              <CollectionItemCover src={getPictureUrl(preview[0].key, 'small')} />
            )
          }
          <ItemInfoBox isCollected={isCollected} isPreview={!!preview[0]}>
            <div>
              <ItemInfoTitle>
                {
                  collection.isPrivate && (
                    <Popover
                      trigger="hover"
                      placement="top"
                      theme="dark"
                      openDelay={100}
                      content={<span>{t('private_xx', t('collection'))}</span>}
                    >
                      <Lock style={{ marginRight: '6px', strokeWidth: '3px' }} size={16} />
                    </Popover>
                  )
                }
                <EmojiText
                  text={collection.name}
                />
              </ItemInfoTitle>
              <ItemInfoCount>
                <span>{t('img_count', collection.pictureCount.toString())}</span>
              </ItemInfoCount>
            </div>
            <ItemHandleIcon>
              {
                isLoading
                  ? <Loading size={6} color="#fff" />
                  : (
                    <>
                      <CheckIcon />
                      <MinusIcon />
                    </>
                  )
              }
            </ItemHandleIcon>
          </ItemInfoBox>
        </CollectionItemBox>
      );
    });
  }
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ backgroundImage: background, padding: 0, maxWidth: rem(500) }}
    >
      <Title>{t('collection_picture.title')}</Title>
      <CollectionBox>
        <CollectionItemBox
          onClick={() => setAddCollectionVisible(true)}
        >
          <ItemInfoBox isCollected={false} isPreview={false}>
            <div>
              <ItemInfoTitle style={{ marginBottom: 0 }}>
                <PlusCircle style={{ marginRight: '12px' }} />
                <span>{t('collection_picture.add')}</span>
              </ItemInfoTitle>
            </div>
          </ItemInfoBox>
        </CollectionItemBox>
        {content}
      </CollectionBox>
      <AddCollectionModal
        onClose={() => setAddCollectionVisible(false)}
        visible={addCollectionVisible}
        onOk={onAddCollectionOk}
      />
    </Modal>
  );
});
