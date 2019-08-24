import Head from 'next/head';
import React from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { PictureList } from '@lib/containers/Picture/List';
import { IMyMobxStore } from '@lib/stores/init';
import { HomeScreenStore } from '@lib/stores/screen/Home';
import { withError } from '@lib/components/withError';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { Namespace } from '@lib/i18n/Namespace';
import { useTranslation } from 'react-i18next';

interface IProps extends IBaseScreenProps {
  homeStore: HomeScreenStore;
}

const Index: ICustomNextPage<IProps, {}> = ({
  homeStore,
}) => {
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>{getTitle(t('home'), t)}</title>
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
    return { namespacesRequired: ['common'] };
  }
  await _.mobxStore.screen.homeStore.getList(undefined, _.req ? _.req.headers : undefined);
  // eslint-disable-next-line no-throw-literal
  return { namespacesRequired: ['common'] };
};

export default pageWithTranslation([Namespace.Common])(
  connect((stores: IMyMobxStore) => ({
    homeStore: stores.screen.homeStore,
  }))(withError(Index)),
);
