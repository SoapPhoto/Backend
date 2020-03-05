import React, { useCallback, useState, useEffect } from 'react';
import { pick } from 'lodash';
import { observer, useLocalStore } from 'mobx-react';
import { useMutation } from 'react-apollo';
import { useRouter as useBaseRouter } from 'next/router';

import { PictureEntity, UpdatePictureDot } from '@lib/common/interfaces/picture';
import { EXIFModal } from '@lib/components/EXIFModal';
import { LikeButton, IconButton } from '@lib/components/Button';
import {
  Info, Settings, Star1,
} from '@lib/icon';
import {
  BaseInfoHandleBox, PictureBaseInfo, HeartIcon, LikeContent,
} from '@lib/styles/views/picture';
import { AddPictureCollectionModal } from '@lib/containers/Collection/AddPictureCollectionModal';
import { EditPictureModal } from '@lib/containers/Picture/EditModal';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router/useRouter';
import { Histore } from '@lib/common/utils';
import { useAccountStore } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { UpdatePicture } from '@lib/schemas/mutations';

interface IProps {
  info: PictureEntity;
  isOwner: boolean;
  isCollected: boolean;
  onLike: () => Promise<void>;
  onOk: (info: PictureEntity) => void;
  deletePicture: () => Promise<void>;
  setPicture: (picture: Partial<PictureEntity>) => void;
}

export const PictureInfo: React.FC<IProps> = observer(({
  info,
  onLike,
  isOwner,
  onOk,
  deletePicture,
  isCollected,
  setPicture,
}) => {
  const {
    params, back, pathname, query,
  } = useRouter();
  const { push, replace } = useBaseRouter();
  const { t } = useTranslation();
  const modalData = useLocalStore(() => ({
    EXIFVisible: false,
    collectionVisible: false,
    editVisible: false,
    setEXIFVisible(value: boolean) {
      this.EXIFVisible = value;
    },
    setCollectionVisible(value: boolean) {
      this.collectionVisible = value;
    },
    setEditVisible(value: boolean) {
      this.editVisible = value;
    },
  }));
  const { isLogin } = useAccountStore();
  const { colors } = useTheme();
  const [update] = useMutation<{updatePicture: PictureEntity}>(UpdatePicture);
  const openWithRoute = useCallback((label: string, value?: boolean, isReplace?: boolean) => {
    let func = push;
    if (isReplace) func = replace;
    if (value) {
      func(`/views/picture?id=${params.id}`, `/picture/${params.id}?modal=${label}`, {
        shallow: true,
      });
      Histore.set('modal', `child-${label}`);
    } else {
      const child = Histore!.get('modal');
      if (/^child/g.test(child)) {
        back();
        Histore.set('modal', `child-${label}-back`);
      } else {
        func(`/views/picture?id=${params.id}`, `/picture/${params.id}`, {
          shallow: true,
        });
      }
    }
  }, [back, params.id, push, replace]);

  useEffect(() => {
    if (query.modal) {
      switch (query.modal) {
        case 'info':
          modalData.setEXIFVisible(true);
          break;
        case 'setting':
          modalData.setEditVisible(isOwner);
          if (!isOwner) openWithRoute('setting', false, true);
          break;
        case 'addCollection':
          modalData.setCollectionVisible(isLogin);
          if (!isLogin) openWithRoute('addCollection', false, true);
          break;
        default:
          modalData.setEXIFVisible(false);
          modalData.setCollectionVisible(false);
          modalData.setEditVisible(false);
          break;
      }
    } else {
      modalData.setEXIFVisible(false);
      modalData.setCollectionVisible(false);
      modalData.setEditVisible(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.modal, pathname]);

  const closeEXIF = useCallback(() => {
    openWithRoute('info');
  }, [openWithRoute]);
  const closeCollection = useCallback(() => {
    openWithRoute('addCollection');
  }, [openWithRoute]);
  const closeEdit = useCallback(() => {
    openWithRoute('setting');
  }, [openWithRoute]);
  const openEXIF = useCallback(() => {
    openWithRoute('info', true);
  }, [openWithRoute]);
  const openCollection = useCallback(() => {
    openWithRoute('addCollection', true);
  }, [openWithRoute]);
  const openEdit = useCallback(() => {
    openWithRoute('setting', true);
  }, [openWithRoute]);

  const updatePicture = async (data: UpdatePictureDot) => {
    const req = await update({
      variables: {
        id: info.id,
        data,
      },
    });
    return req.data!.updatePicture;
  };
  return (
    <PictureBaseInfo>
      <div>
        <LikeContent
          transformTemplate={({ scale }: any) => `translate(0, 0) scale(${scale})`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={onLike}
        >
          <HeartIcon
            size={20}
            islike={info.isLike ? 1 : 0}
          />
          <p>{info.likedCount}</p>
        </LikeContent>
        {/* <LikeButton
          color={colors.secondary}
          isLike={info.isLike}
          size={22}
          onLike={onLike}
        /> */}
      </div>
      {/* //TODO */}
      <span style={{ display: 'none' }}>{params.type}</span>
      <BaseInfoHandleBox
        flow="column"
        columns="auto"
        justifyContent="right"
      >
        <IconButton popover={t('picture.info.title')} onClick={openEXIF}>
          <Info
            color={colors.secondary}
          />
        </IconButton>
        {
          isLogin && (
            <IconButton popover={t('add_collection')} onClick={openCollection}>
              <Star1
                style={{
                  stroke: isCollected ? colors.baseGreen : colors.secondary,
                  fill: isCollected ? colors.baseGreen : 'transparent',
                }}
              />
            </IconButton>
          )
        }
        {
          isOwner && (
            <IconButton popover={t('picture.edit.title')} onClick={openEdit}>
              <Settings
                color={colors.secondary}
              />
            </IconButton>
          )
        }
      </BaseInfoHandleBox>
      {
        isLogin && (
          <>
            <AddPictureCollectionModal
              picture={info}
              visible={modalData.collectionVisible}
              onClose={closeCollection}
              currentCollections={info.currentCollections || []}
              setPicture={setPicture}
            />
            {
              isOwner && (
                <EditPictureModal
                  visible={modalData.editVisible}
                  onClose={closeEdit}
                  defaultValue={{
                    ...pick(info, ['title', 'bio', 'isPrivate']),
                    tags: info.tags.map(tag => tag.name),
                  }}
                  onOk={onOk}
                  update={updatePicture}
                  deletePicture={deletePicture}
                />
              )
            }
          </>
        )
      }
      <EXIFModal
        visible={modalData.EXIFVisible}
        onClose={closeEXIF}
        picture={info}
      />
    </PictureBaseInfo>
  );
});
