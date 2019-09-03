import dayjs from 'dayjs';
import React, { useCallback, useState, useEffect } from 'react';
import _ from 'lodash';

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
import { AddPictureCollectonModal } from '@lib/containers/Collection/AddPictureCollectonModal';
import { EditPictureModal } from '@lib/containers/Picture/EditModal';
import { useTranslation } from '@lib/i18n/useTranslation';
import { updatePicture } from '@lib/services/picture';
import { useRouter } from '@lib/router/useRouter';
import { Histore } from '@lib/common/utils';
import { useAccountStore } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';

interface IProps {
  info: PictureEntity;
  isOwner: boolean;
  onLike: () => Promise<void>;
  onOk: (info: PictureEntity) => void;
}

export const PictureInfo: React.FC<IProps> = ({
  info,
  onLike,
  isOwner,
  onOk,
}) => {
  const {
    pushRoute, params, back, replaceRoute,
  } = useRouter();
  const { t } = useTranslation();
  const [EXIFVisible, setEXIFVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { isLogin } = useAccountStore();
  const { colors } = useTheme();
  const push = useCallback((label: string, value?: boolean, replace?: boolean) => {
    let func = pushRoute;
    if (replace) func = replaceRoute;
    if (value) {
      func(`/picture/${info.id}/${label}`, {}, {
        shallow: true,
        state: {
          data: `child-${label}`,
        },
      });
    } else {
      const child = Histore!.get('data');
      if (child === `child-${label}`) {
        back();
      } else {
        func(`/picture/${info.id}`, {}, {
          shallow: true,
        });
      }
    }
  }, [back, info.id, pushRoute, replaceRoute]);

  useEffect(() => {
    const { type } = params;
    if (type) {
      switch (type) {
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
  }, [isLogin, isOwner, params, push]);

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
                color={colors.secondary}
              />
            </IconButton>
          )
        }
        {
          isOwner && (
            <IconButton popover="编辑设置" onClick={openEdit}>
              <Settings
                color={colors.secondary}
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
};
