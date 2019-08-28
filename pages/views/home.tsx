import Head from 'next/head';
import React from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { connect } from '@lib/common/utils/store';
import { PictureList } from '@lib/containers/Picture/List';
import { IMyMobxStore } from '@lib/stores/init';
import { HomeScreenStore } from '@lib/stores/screen/Home';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { getTitle } from '@lib/common/utils';

interface IProps extends IBaseScreenProps {
  homeStore: HomeScreenStore;
}

const Index: ICustomNextPage<IProps, {}> = ({
  homeStore,
}) => {
  const { t } = useTranslation();
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;

  return (
    <div>
      <Head>
        <title>{getTitle('home', t)}</title>
      </Head>
      <PictureList noMore={isNoMore} onPage={getPageList} like={like} data={list} />
    </div>
  );
};

Index.getInitialProps = async (_: ICustomNextContext) => {
  if (
    _.mobxStore.appStore.location
    && _.mobxStore.appStore.location.action === 'POP'
    && _.mobxStore.screen.homeStore.init
  ) {
    return {};
  }
  await _.mobxStore.screen.homeStore.getList(undefined, _.req ? _.req.headers : undefined);
  // eslint-disable-next-line no-throw-literal
  return {};
};

export default connect((stores: IMyMobxStore) => ({
  homeStore: stores.screen.homeStore,
}))(withError(pageWithTranslation()(Index)));
