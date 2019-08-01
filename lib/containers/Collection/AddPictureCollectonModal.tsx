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

interface IProps {
  visible: boolean;
  themeStore?: ThemeStore;
  appStore?: AppStore;
  picture: PictureEntity;
  onClose: () => void;
}

const Title = styled.h2`
  font-size: ${_ => _.theme.fontSizes[3]};
  padding: ${rem('24px')};
`;

const CollectionItemBox = styled.button`
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
`;

const CollectionBox = styled.div`
  padding: ${rem(24)};
`;

const CollectionItemCover = styled.img`
  font-family: "object-fit:cover";
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const CollectionItemInfoBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${_ => rgba(_.theme.colors.text, 0.3)};
  transition: all .15s ease-in-out;
  padding: 17px 20px;
  color: ${_ => _.theme.colors.pure};
`;

const CollectionItemInfoTitle = styled.p`
  color: ${_ => _.theme.colors.pure};
  font-size: ${_ => _.theme.fontSizes[3]}px;
  font-weight: 700;
`;


export const AddPictureCollectonModal = connect<React.FC<IProps>>('themeStore', 'appStore')(({
  visible,
  themeStore,
  appStore,
  picture,
  onClose,
}) => {
  const { key } = picture;
  const { getCollection, userCollection } = appStore!;
  const { themeData } = themeStore!;
  // eslint-disable-next-line max-len
  const background = `linear-gradient(${rgba(themeData.colors.pure, 0.8)}, ${themeData.colors.pure} 200px), url("${getPictureUrl(key)}")`;
  useEffect(() => {
    console.log(1412412414);
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
          userCollection.map(collection => (
            <CollectionItemBox>
              {
                collection.preview[0] && (
                  <CollectionItemCover src={getPictureUrl(collection.preview[0].key)} />
                )
              }
              <CollectionItemInfoBox>
                <CollectionItemInfoTitle>
                  {collection.name}
                </CollectionItemInfoTitle>
              </CollectionItemInfoBox>
            </CollectionItemBox>
          ))
        }
      </CollectionBox>
    </Modal>
  );
});
