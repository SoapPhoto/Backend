import Head from 'next/head';
import React from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { PictureList } from '@lib/containers/Picture/List';
import { IMyMobxStore } from '@lib/stores/init';
import { HomeScreenStore } from '@lib/stores/screen/Home';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';

interface IProps extends IBaseScreenProps {
  homeStore: HomeScreenStore;
}

const Index: ICustomNextPage<IProps> = ({
  homeStore,
}) => {
  const { value } = useTranslation();
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;
  console.log(value);
  return (
    <div>
      <Head>
        <title>test</title>
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
    return { namespacesRequired: [I18nNamespace.Common] };
  }
  await _.mobxStore.screen.homeStore.getList(undefined, _.req ? _.req.headers : undefined);
  // eslint-disable-next-line no-throw-literal
  return { namespacesRequired: [I18nNamespace.Common] };
};

export default connect((stores: IMyMobxStore) => ({
  homeStore: stores.screen.homeStore,
}))(withError(pageWithTranslation()(Index)));
