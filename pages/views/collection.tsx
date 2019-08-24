import React from 'react';
import { withError } from '@lib/components/withError';
import Head from 'next/head';
import { getTitle } from '@lib/common/utils';
import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { CollectionScreenStore } from '@lib/stores/screen/Collection';
import { connect } from '@lib/common/utils/store';
import { IMyMobxStore } from '@lib/stores/init';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { Package } from '@lib/icon';
import { Avatar } from '@lib/components';
import { A } from '@lib/components/A';
import { theme, activte } from '@lib/common/utils/themes';
import { PictureList } from '@lib/containers/Picture/List';
import { withTranslation } from '@common/i18n';

interface IProps extends IBaseScreenProps {
  collectionStore: CollectionScreenStore;
}

const Header = styled.div`
  padding: 0 ${rem('24px')};
  margin: ${rem('46px')} auto;
  margin-bottom: ${rem(42)};
  max-width: ${rem('1300px')};
`;

const Title = styled.h2`
  width: 100%;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  text-align: center;
  font-size: ${rem('50px')};
  margin: ${rem(5)} 0 ${rem(25)};
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
  ${activte()}
`;

const Collection: ICustomNextPage<IProps, {}> = ({
  collectionStore,
}) => {
  const { info, list } = collectionStore!;
  const {
    name, user, pictureCount,
  } = info!;
  return (
    <div>
      <Head>
        <title>{getTitle(`${name} (@${user.username})`)}</title>
      </Head>
      <Header>
        <Title>
          {name}
        </Title>
        <Info>
          <User>
            <A route={`/@${user.username}`}>
              <Avatar css={css`${activte()}`} src={user.avatar} />
            </A>
            <UserName route={`/@${user.username}`}>
              {user.username}
            </UserName>
          </User>
          <PictureNumber>
            <Package />
            <span>
              {pictureCount}
              {' '}
              个照片
            </span>
          </PictureNumber>
        </Info>
      </Header>
      <PictureList
        data={list}
        like={() => {}}
        noMore
      />
    </div>
  );
};

Collection.getInitialProps = async (ctx) => {
  const { route } = ctx;
  const { id } = route.params;
  const { appStore, screen } = ctx.mobxStore;
  const { collectionStore } = screen;
  const headers = ctx.req ? ctx.req.headers : undefined;
  const isPop = appStore.location && appStore.location.action === 'POP';
  if ((isPop && !collectionStore.getInfoCache(id!)) || !isPop) {
    await collectionStore.getInfo(id!, headers);
  }
  if ((isPop && !collectionStore.getPictureCache(id!)) || !isPop) {
    await collectionStore.getList(id!, headers);
  }

  return { namespacesRequired: ['common'] };
};

export default withTranslation()(withError(
  connect((stores: IMyMobxStore) => ({
    collectionStore: stores.screen.collectionStore,
  }))(Collection),
));
