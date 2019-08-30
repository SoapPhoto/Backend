import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import _ from 'lodash';

import { PictureEntity, UpdatePictureDot } from '@lib/common/interfaces/picture';
import { connect } from '@lib/common/utils/store';
import { EXIFModal } from '@lib/components/EXIFModal';
import { LikeButton, IconButton } from '@lib/components/Button';
import { Popover } from '@lib/components/Popover';
import {
  Clock, Bookmark, Info, Settings,
} from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { IMyMobxStore } from '@lib/stores/init';
import { ThemeStore } from '@lib/stores/ThemeStore';
import {
  BaseInfoHandleBox, BaseInfoItem, PictureBaseInfo,
} from '@lib/styles/views/picture';
import { AddPictureCollectonModal } from '@lib/containers/Collection/AddPictureCollectonModal';
import { EditPictureModal } from '@lib/containers/Picture/EditModal';
import { useTranslation } from '@lib/i18n/useTranslation';
import { updatePicture } from '@lib/services/picture';

interface IProps {
  info: PictureEntity;
  isOwner: boolean;
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
  onLike: () => Promise<void>;
  onOk: (info: PictureEntity) => void;
}

export const PictureInfo = connect<React.FC<IProps>>((stores: IMyMobxStore) => ({
  accountStore: stores.accountStore,
  themeStore: stores.themeStore,
}))(({
  info,
  accountStore,
  themeStore,
  onLike,
  isOwner,
  onOk,
}) => {
  const { t } = useTranslation();
  const [EXIFVisible, setEXIFVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { isLogin } = accountStore!;
  const { themeData } = themeStore!;

  const closeEXIF = useCallback(() => {
    setEXIFVisible(false);
  }, []);
  const closeCollection = useCallback(() => {
    setCollectionVisible(false);
  }, []);
  const closeEdit = useCallback(() => {
    setEditVisible(false);
  }, []);
  const openEXIF = useCallback(() => {
    setEXIFVisible(true);
  }, []);
  const openCollection = useCallback(() => {
    setCollectionVisible(true);
  }, []);
  const openEdit = useCallback(() => {
    setEditVisible(true);
  }, []);

  const update = async (data: UpdatePictureDot) => updatePicture(info.id, data);

  return (
    <PictureBaseInfo>
      <div>
        <Popover
          openDelay={100}
          trigger="hover"
          placement="top"
          theme="dark"
          content={<span>{dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
        >
          <BaseInfoItem>
            <Clock size={20} />
            <p>{dayjs(info.createTime).fromNow()}</p>
          </BaseInfoItem>
        </Popover>
      </div>
      <BaseInfoHandleBox
        flow="column"
        columns="auto"
        justifyContent="right"
      >
        <IconButton popover={t('picture_info')} onClick={openEXIF}>
          <Info
            color={themeData.colors.secondary}
          />
        </IconButton>
        {
          isLogin && (
            <LikeButton
              color={themeData.colors.secondary}
              isLike={info.isLike}
              size={22}
              onLike={onLike}
            />
          )
        }
        {
          isLogin && (
            <IconButton popover={t('add_collection')} onClick={openCollection}>
              <Bookmark
                color={themeData.colors.secondary}
              />
            </IconButton>
          )
        }
        {
          isOwner && (
            <IconButton popover="编辑设置" onClick={openEdit}>
              <Settings
                color={themeData.colors.secondary}
              />
            </IconButton>
          )
        }
      </BaseInfoHandleBox>
      <EditPictureModal
        visible={editVisible}
        onClose={closeEdit}
        defaultValue={{
          ..._.pick(info, ['title', 'bio', 'isPrivate']),
          tags: info.tags.map(tag => tag.name),
        }}
        onOk={onOk}
        update={update}
      />
      <EXIFModal
        visible={EXIFVisible}
        onClose={closeEXIF}
        picture={info}
      />
      <AddPictureCollectonModal
        picture={info}
        visible={collectionVisible}
        onClose={closeCollection}
        currentCollections={info.currentCollections || []}
      />
    </PictureBaseInfo>
  );
});
