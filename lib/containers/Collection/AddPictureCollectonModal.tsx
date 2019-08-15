/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Modal } from '@lib/components/Modal';
import { connect } from '@lib/common/utils/store';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { rgba, rem } from 'polished';
import { getPictureUrl } from '@lib/common/utils/image';
import styled from 'styled-components';
import { AppStore } from '@lib/stores/AppStore';
import { CollectionEntity } from '@lib/common/interfaces/collection';
import { Check, Minus, PlusCircle } from '@lib/icon';
import { removePictureCollection, addPictureCollection } from '@lib/services/collection';
import { Loading } from '@lib/components/Loading';
import { Image } from '@lib/components/Image';
import { theme } from '@lib/common/utils/themes';
import { AddCollectionModal } from './AddCollectionModal';

interface IProps {
  visible: boolean;
  themeStore?: ThemeStore;
  appStore?: AppStore;
  picture: PictureEntity;
  onClose: () => void;
  currentCollections: CollectionEntity[];
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
  &:active {
    transform: scale(0.98);
  }
`;

const CollectionBox = styled.div`
  padding: ${rem(24)};
  display: grid;
  grid-gap: 14px;
`;

const CollectionItemCover = styled(Image)`
  font-family: "object-fit:cover";
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: blur(4px);
`;

const ItemInfoBox = styled.div<{isCollected: boolean}>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: ${theme('styles.collection.addPicture.background')};
  transition: all .15s ease-in-out;
  padding: 17px 20px;
  color: ${theme('styles.collection.addPicture.color')};
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


export const AddPictureCollectonModal = connect<React.FC<IProps>>('themeStore', 'appStore')(({
  visible,
  themeStore,
  appStore,
  picture,
  onClose,
  currentCollections,
}) => {
  const { key, id } = picture;
  const { getCollection, userCollection, addCollection } = appStore!;
  const { themeData } = themeStore!;
  const [addCollectionVisible, setAddCollectionVisible] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState<Map<string, CollectionEntity>>(new Map());
  // eslint-disable-next-line max-len
  const background = `linear-gradient(${rgba(themeData.colors.pure, 0.8)}, ${themeData.colors.pure} 200px), url("${getPictureUrl(key, 'blur')}")`;
  useEffect(() => {
    getCollection();
  }, []);
  useEffect(() => {
    setCurrent(
      new Map(currentCollections.map(collection => [collection.id, collection])),
    );
  }, [currentCollections]);
  useEffect(() => {
    const obj: Record<string, boolean> = {};
    userCollection.forEach(collection => obj[collection.id] = false);
    setLoading(obj);
  }, [userCollection]);
  useEffect(() => {
    getCollection();
  }, [visible]);
  const onCollected = async (collection: CollectionEntity, isCollected: boolean) => {
    if (loading[collection.id]) {
      return;
    }
    setLoading(ld => ({
      ...ld,
      [collection.id]: true,
    }));
    try {
      if (isCollected) {
        await removePictureCollection(collection.id, id);
        current.delete(collection.id);
        setCurrent(current);
      } else {
        await addPictureCollection(collection.id, id);
        setCurrent(current.set(collection.id, collection));
      }
    } finally {
      getCollection();
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
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ backgroundImage: background, padding: 0 }}
    >
      <Title>添加到收藏夹</Title>
      <CollectionBox>
        <CollectionItemBox
          onClick={() => setAddCollectionVisible(true)}
        >
          <ItemInfoBox isCollected={false}>
            <div>
              <ItemInfoTitle style={{ marginBottom: 0 }}>
                <PlusCircle style={{ marginRight: '12px' }} />
                <span>新增收藏夹</span>
              </ItemInfoTitle>
            </div>
          </ItemInfoBox>
        </CollectionItemBox>
        {
          userCollection.map((collection) => {
            const isCollected = current.has(collection.id);
            const isLoading = loading[collection.id];
            return (
              <CollectionItemBox
                key={collection.id}
                onClick={() => !isLoading && onCollected(collection, isCollected)}
              >
                {
                  collection.preview[0] && (
                    <CollectionItemCover src={getPictureUrl(collection.preview[0].key, 'thumb')} />
                  )
                }
                <ItemInfoBox isCollected={isCollected}>
                  <div>
                    <ItemInfoTitle>
                      {collection.name}
                    </ItemInfoTitle>
                    <ItemInfoCount>
                      <span>{collection.pictureCount}</span>
                      <span>个图片</span>
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
          })
        }
      </CollectionBox>
      <AddCollectionModal
        onClose={() => setAddCollectionVisible(false)}
        visible={addCollectionVisible}
        onOk={onAddCollectionOk}
      />
    </Modal>
  );
});
