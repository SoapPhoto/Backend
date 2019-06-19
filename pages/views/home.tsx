import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import React from 'react';

import { CustomNextContext, CustomNextPage } from '@pages/common/interfaces/global';
import { getTitle } from '@pages/common/utils';
import { connect } from '@pages/common/utils/store';
import { PictureList } from '@pages/containers/Picture/List';
import { IMyMobxStore } from '@pages/stores/init';
import { HomeScreenStore } from '@pages/stores/screen/Home';

interface IProps {
  homeStore: HomeScreenStore;
}

const Index: CustomNextPage<IProps, any> = ({
  homeStore,
}) => {
  const { list, like, getPageList, isNoMore } = homeStore;
  return (
    <div>
      <Head>
        <title>{getTitle('首页')}</title>
      </Head>
      <PictureList noMore={isNoMore} onPage={getPageList} like={like} data={list} />
    </div>
  );
};

Index.getInitialProps = async (_: CustomNextContext) => {
  if (
    _.mobxStore.appStore.location &&
    _.mobxStore.appStore.location.action === 'POP' &&
    _.mobxStore.screen.homeStore.init
  ) {
    return {};
  }
  await _.mobxStore.screen.homeStore.getList(undefined, _.req ? _.req.headers : undefined);
  return {};
};

export default connect((stores: IMyMobxStore) => ({
  homeStore: stores.screen.homeStore,
}))(Index);
