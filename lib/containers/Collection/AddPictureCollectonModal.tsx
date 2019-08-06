/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { Modal } from '@lib/components/Modal';
import { connect } from '@lib/common/utils/store';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { rgba, rem } from 'polished';
import { getPictureUrl } from '@lib/common/utils/image';
import styled from 'styled-components';
import { AppStore } from '@lib/stores/AppStore';
import { CollectionEntity } from '@lib/common/interfaces/collection';
import { Check, Minus } from '@lib/icon';
import { Loading } from '@lib/components/Loading';

interface IProps {
  visible: boolean;
  themeStore?: ThemeStore;
  appStore?: AppStore;
  picture: PictureEntity;
  onClose: () => void;
  currentCollections: CollectionEntity[];
}

const Title = styled.h2`
  font-size: ${_ => _.theme.fontSizes[3]};
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

const CollectionItemCover = styled.img`
  font-family: "object-fit:cover";
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
  height: 100%;
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
  background: ${_ => rgba(_.theme.colors.text, 0.3)};
  transition: all .15s ease-in-out;
  padding: 17px 20px;
  color: ${_ => _.theme.colors.pure};
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
      background: linear-gradient(45deg, ${rgba(_.theme.colors.text, 0.3)}, ${_.theme.colors.baseGreen});
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
  color: ${_ => _.theme.colors.pure};
  font-size: ${_ => _.theme.fontSizes[3]}px;
  font-weight: 700;
  margin-bottom: ${rem(6)};
`;

const ItemInfoCount = styled.p`
  font-size: ${_ => _.theme.fontSizes[0]}px;
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
  const { key } = picture;
  const { getCollection, userCollection } = appStore!;
  const { themeData } = themeStore!;
  // eslint-disable-next-line max-len
  const background = `linear-gradient(${rgba(themeData.colors.pure, 0.8)}, ${themeData.colors.pure} 200px), url("${getPictureUrl(key)}")`;
  useEffect(() => {
    getCollection();
  }, []);
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ backgroundImage: background, padding: 0 }}
    >
      <Title>添加到收藏夹</Title>
      <CollectionBox>
        {
          userCollection.map((collection) => {
            const isCollected = currentCollections.findIndex(cl => cl.id === collection.id) >= 0;
            return (
              <CollectionItemBox key={collection.id}>
                {
                  collection.preview[0] && (
                    <CollectionItemCover src={getPictureUrl(collection.preview[0].key)} />
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
                    <Loading size={6} color="#fff" />
                    {/* <CheckIcon />
                    <MinusIcon /> */}
                  </ItemHandleIcon>
                </ItemInfoBox>
              </CollectionItemBox>
            );
          })
        }
      </CollectionBox>
    </Modal>
  );
});
