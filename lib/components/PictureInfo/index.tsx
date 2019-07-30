import moment from 'moment';
import React, { useCallback, useState } from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { connect } from '@lib/common/utils/store';
import { EXIFModal } from '@lib/components/EXIFModal';
import { LikeButton } from '@lib/components/LikeButton';
import { Popover } from '@lib/components/Popover';
import { Calendar } from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { IMyMobxStore } from '@lib/stores/init';
import { ThemeStore } from '@lib/stores/ThemeStore';
import {
  BaseInfoHandleBox, BaseInfoItem, InfoButton, PictureBaseInfo,
} from '@lib/styles/views/picture';

interface IProps {
  info: PictureEntity;
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
  onLike: () => Promise<void>;
}

export const PictureInfo = connect<React.FC<IProps>>((stores: IMyMobxStore) => ({
  accountStore: stores.accountStore,
  themeStore: stores.themeStore,
}))(({
  info,
  accountStore,
  themeStore,
  onLike,
}) => {
  const [EXIFVisible, setEXIFVisible] = useState(false);
  const { isLogin } = accountStore!;
  const { themeData } = themeStore!;

  const closeEXIF = useCallback(() => {
    setEXIFVisible(false);
  }, []);
  const openEXIF = useCallback(() => {
    setEXIFVisible(true);
  }, []);
  return (
    <PictureBaseInfo>
      <div>
        <Popover
          openDelay={100}
          trigger="hover"
          placement="top"
          theme="dark"
          content={<span>{moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
        >
          <BaseInfoItem>
            <Calendar size={20} />
            <p>{moment(info.createTime).from()}</p>
          </BaseInfoItem>
        </Popover>
      </div>
      <BaseInfoHandleBox>
        <Popover
          trigger="hover"
          placement="top"
          theme="dark"
          openDelay={100}
          content={<span>图片信息</span>}
        >
          <div
            style={{ fontSize: 0 }}
            onClick={openEXIF}
          >
            <InfoButton style={{ cursor: 'pointer' }} />
          </div>
        </Popover>
        {
          isLogin
          && (
            <LikeButton
              color={themeData.colors.secondary}
              isLike={info.isLike}
              size={22}
              onLike={onLike}
            />
          )
        }
      </BaseInfoHandleBox>
      <EXIFModal
        visible={EXIFVisible}
        onClose={closeEXIF}
        picture={info}
      />
    </PictureBaseInfo>
  );
});
