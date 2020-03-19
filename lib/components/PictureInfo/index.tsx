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
import { WithQueryParam } from '../WithQueryParam';

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
  const [update] = useMutation<{ updatePicture: PictureEntity }>(UpdatePicture);
  const openWithRoute = useCallback((label: string) => {
    push(`/views/picture?id=${params.id}`, `/picture/${params.id}?action=${label}`, {
      shallow: true,
    });
    Histore.set('modal', `child-${label}`);
  }, [params.id, push]);

  const openEXIF = useCallback(() => {
    openWithRoute('info');
  }, [openWithRoute]);
  const openCollection = useCallback(() => {
    openWithRoute('addCollection');
  }, [openWithRoute]);
  const openEdit = useCallback(() => {
    openWithRoute('setting');
  }, [openWithRoute]);

  const backNow = useCallback(() => {
    push(`/views/picture?id=${params.id}`, `/picture/${params.id}`, {
      shallow: true,
    });
  }, [params.id, push]);

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
            <WithQueryParam action="addCollection" back={backNow}>
              {(visible, backView) => (
                <AddPictureCollectionModal
                  picture={info}
                  visible={visible}
                  onClose={backView}
                  currentCollections={info.currentCollections || []}
                  setPicture={setPicture}
                />
              )}
            </WithQueryParam>
            {
              isOwner && (
                <WithQueryParam action="setting" back={backNow}>
                  {(visible, backView) => (
                    <EditPictureModal
                      visible={visible}
                      defaultValue={{
                        ...pick(info, ['title', 'bio', 'isPrivate']),
                        tags: info.tags.map(tag => tag.name),
                      }}
                      onClose={backView}
                      onOk={onOk}
                      update={updatePicture}
                      deletePicture={deletePicture}
                    />
                  )}
                </WithQueryParam>
              )
            }
          </>
        )
      }
      <WithQueryParam action="info" back={backNow}>
        {(visible, backView) => (
          <EXIFModal
            visible={visible}
            onClose={backView}
            picture={info}
          />
        )}
      </WithQueryParam>
    </PictureBaseInfo>
  );
});
