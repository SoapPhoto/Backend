import React, { useEffect, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { pick } from 'lodash';
import { NextSeo } from 'next-seo';

import { withError } from '@lib/components/withError';
import { getTitle, Histore, server } from '@lib/common/utils';
import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { CollectionScreenStore } from '@lib/stores/screen/Collection';
import { Package, Lock, Settings } from '@lib/icon';
import { Avatar, EmojiText } from '@lib/components';
import { A } from '@lib/components/A';
import { theme, activate } from '@lib/common/utils/themes';
import { PictureList } from '@lib/containers/Picture/List';
import { Popover } from '@lib/components/Popover';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useScreenStores, useAccountStore } from '@lib/stores/hooks';
import { useTranslation } from '@lib/i18n/useTranslation';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { useRouter } from '@lib/router';
import { UpdateCollectionModal } from '@lib/containers/Collection/UpdateCollectionModal';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTheme } from '@lib/common/utils/themes/useTheme';

interface IProps extends IBaseScreenProps {
  collectionStore: CollectionScreenStore;
}

const Header = styled.div`
  ${WrapperBox()}
  padding: 0 ${rem('24px')};
  margin-top: ${rem(42)};
  margin-bottom: ${rem(42)};
`;

const Title = styled.h2`
  position: relative;
  width: 100%;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  text-align: center;
  font-size: ${rem('50px')};
  margin: ${rem(5)} 0 ${rem(25)};
  display: flex;
  align-items: center;
  justify-content: center;
`;


const PictureNumber = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: ${rem('6px')};
    margin-top: -${rem('2px')};
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const User = styled.div`
  margin-bottom: ${rem(12)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled(A)`
  margin-left: ${rem(6)};
  font-weight: 600;
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: ${theme('colors.text')};
  ${activate()}
`;

const EditIcon = styled(Settings)`
  margin-left: ${rem(12)};
  stroke: ${theme('colors.secondary')};
  cursor: pointer;
  ${activate(0.8)}
`;


const useUpdateVisible = (isOwner: boolean): [boolean, (value: boolean) => void] => {
  const [visible, seVisible] = useState(false);
  const {
    params, pushRoute, replaceRoute, back,
  } = useRouter();

  const set = useCallback(async (value: boolean, replace?: boolean) => {
    let func = pushRoute;
    if (replace) func = replaceRoute;
    if (value) {
      await func(`/collection/${params.id}/setting`, {}, {
        shallow: true,
        state: {
          data: 'child-setting',
        },
      });
    } else {
      const child = Histore!.get('data');
      if (child === 'child-setting') {
        await back();
      } else {
        await func(`/picture/${params.id}`, {}, {
          shallow: true,
        });
      }
    }
  }, [back, params.id, pushRoute, replaceRoute]);

  useEffect(() => {
    const { type } = params;
    if (type && type === 'setting') {
      seVisible(true);
      if (!isOwner) set(false, true);
    } else {
      seVisible(false);
    }
  }, [isOwner, params, set]);
  return [visible, set];
};

const Collection: ICustomNextPage<IProps, {}> = () => {
  const { collectionStore, collectionPictureStore } = useScreenStores();
  const { userInfo } = useAccountStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    info, updateCollection,
  } = collectionStore;
  const {
    list, like,
  } = collectionPictureStore;
  const {
    name, user, pictureCount, isPrivate, bio,
  } = info!;
  const isOwner = !!(userInfo && userInfo.id.toString() === user.id.toString());
  const [updateVisible, setUpdateVisible] = useUpdateVisible(isOwner);
  const onUpdateClose = useCallback(async () => {
    await setUpdateVisible(false);
  }, [setUpdateVisible]);
  return (
    <div>
      <NextSeo
        title={getTitle(`${name} (@${user.username})`, t)}
        description={bio}
      />
      <Header>
        <Title>
          {
            isPrivate && (
              <Popover
                trigger="hover"
                placement="top"
                theme="dark"
                openDelay={100}
                content={<span>{t('private_xx', t('collection'))}</span>}
              >
                <Lock
                  style={{ stroke: colors.secondary, marginRight: rem(12) }}
                />
              </Popover>
            )
          }
          <EmojiText
            text={name}
          />
          {
            isOwner && (
              <EditIcon onClick={() => setUpdateVisible(true)} />
            )
          }
        </Title>
        <Info>
          <User>
            <A route={`/@${user.username}`}>
              <Avatar css={css`${activate()}` as any} src={user.avatar} />
            </A>
            <UserName route={`/@${user.username}`}>
              <EmojiText
                text={user.fullName}
              />
            </UserName>
          </User>
          <PictureNumber>
            <Package />
            <span>
              {t('img_count', pictureCount.toString())}
            </span>
          </PictureNumber>
        </Info>
      </Header>
      <UpdateCollectionModal
        visible={updateVisible}
        onClose={onUpdateClose}
        onUpdate={updateCollection}
        defaultValue={pick(info!, ['name', 'bio', 'isPrivate'])}
      />
      <PictureList
        data={list}
        like={like}
        noMore
      />
    </div>
  );
};

Collection.getInitialProps = async (ctx) => {
  const { route } = ctx;
  const { id } = route.params;
  const { appStore, screen } = ctx.mobxStore;
  const { collectionStore, collectionPictureStore } = screen;
  const { location } = appStore;
  const isPop = location && location.action === 'POP' && !server;
  if (isPop) {
    await Promise.all([
      collectionStore.getCache(id!),
      collectionPictureStore.getCache(id!),
    ]);
  } else {
    await Promise.all([
      collectionStore.getInfo(id!),
      collectionPictureStore.getList(id!),
    ]);
  }
  return {};
};

export default withError(pageWithTranslation(I18nNamespace.Collection)(Collection));
