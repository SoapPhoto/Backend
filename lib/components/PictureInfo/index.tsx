import dayjs from 'dayjs';
import React, { useCallback, useState, useEffect } from 'react';
import { pick } from 'lodash';

import { PictureEntity, UpdatePictureDot } from '@lib/common/interfaces/picture';
import { EXIFModal } from '@lib/components/EXIFModal';
import { LikeButton, IconButton } from '@lib/components/Button';
import { Popover } from '@lib/components/Popover';
import {
  Clock, Bookmark, Info, Settings,
} from '@lib/icon';
import {
  BaseInfoHandleBox, BaseInfoItem, PictureBaseInfo,
} from '@lib/styles/views/picture';
import { AddPictureCollectionModal } from '@lib/containers/Collection/AddPictureCollectionModal';
import { EditPictureModal } from '@lib/containers/Picture/EditModal';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router/useRouter';
import { Histore } from '@lib/common/utils';
import { useAccountStore } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { observer } from 'mobx-react';
import { useMutation } from '@apollo/react-hooks';
import { UpdatePicture } from '@lib/schemas/mutations';

interface IProps {
  info: PictureEntity;
  isOwner: boolean;
  isCollected: boolean;
  onLike: () => Promise<void>;
  onOk: (info: PictureEntity) => void;
  deletePicture: () => Promise<void>;
}

export const PictureInfo: React.FC<IProps> = observer(({
  info,
  onLike,
  isOwner,
  onOk,
  deletePicture,
  isCollected,
}) => {
  const {
    pushRoute, params, back, replaceRoute, pathname,
  } = useRouter();
  const { t } = useTranslation();
  const [EXIFVisible, setEXIFVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { isLogin } = useAccountStore();
  const { colors } = useTheme();
  const [update] = useMutation<{updatePicture: PictureEntity}>(UpdatePicture);
  const push = useCallback((label: string, value?: boolean, replace?: boolean) => {
    let func = pushRoute;
    if (replace) func = replaceRoute;
    if (value) {
      func(`/picture/${params.id}/${label}`, {}, {
        shallow: true,
        state: {
          modal: `child-${label}`,
        },
      });
    } else {
      const child = Histore!.get('modal');
      if (/^child/g.test(child)) {
        back();
        Histore.set('modal', `child-${label}-back`);
      } else {
        func(`/picture/${params.id}`, {}, {
          shallow: true,
        });
      }
    }
  }, [back, params.id, pushRoute, replaceRoute]);

  useEffect(() => {
    if (params.type) {
      switch (params.type) {
        case 'info':
          setEXIFVisible(true);
          break;
        case 'setting':
          setEditVisible(isOwner);
          if (!isOwner) push('setting', false, true);
          break;
        case 'addCollection':
          setCollectionVisible(isLogin);
          if (!isLogin) push('addCollection', false, true);
          break;
        default:
          break;
      }
    } else {
      setEXIFVisible(false);
      setCollectionVisible(false);
      setEditVisible(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.type, pathname]);

  const closeEXIF = useCallback(() => {
    push('info');
  }, [push]);
  const closeCollection = useCallback(() => {
    push('addCollection');
  }, [push]);
  const closeEdit = useCallback(() => {
    push('setting');
  }, [push]);
  const openEXIF = useCallback(() => {
    push('info', true);
  }, [push]);
  const openCollection = useCallback(() => {
    push('addCollection', true);
  }, [push]);
  const openEdit = useCallback(() => {
    push('setting', true);
  }, [push]);

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
      {/* //TODO */}
      <span style={{ display: 'none' }}>{params.type}</span>
      <BaseInfoHandleBox
        flow="column"
        columns="auto"
        justifyContent="right"
      >
        <IconButton popover={t('picture_info')} onClick={openEXIF}>
          <Info
            color={colors.secondary}
          />
        </IconButton>
        {
          isLogin && (
            <LikeButton
              color={colors.secondary}
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
            <IconButton popover={t('picture_edit.title')} onClick={openEdit}>
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
              visible={collectionVisible}
              onClose={closeCollection}
              currentCollections={info.currentCollections || []}
            />
            {
              isOwner && (

                <EditPictureModal
                  visible={editVisible}
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
        visible={EXIFVisible}
        onClose={closeEXIF}
        picture={info}
      />
    </PictureBaseInfo>
  );
});
