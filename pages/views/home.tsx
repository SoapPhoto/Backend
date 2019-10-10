import React from 'react';
import { NextSeo } from 'next-seo';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureList } from '@lib/containers/Picture/List';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { getTitle } from '@lib/common/utils';
import { useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';

const Index: ICustomNextPage<IBaseScreenProps, {}> = observer(() => {
  const { t } = useTranslation();
  const { homeStore } = useScreenStores();
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;
  return (
    <div>
      <NextSeo
        title={getTitle('home', t)}
        description="photo, life, happy"
      />
      <PictureList noMore={isNoMore} onPage={getPageList} like={like} data={list} />
    </div>
  );
});

Index.getInitialProps = async (_: ICustomNextContext) => {
  if (
    _.mobxStore.appStore.location
    && _.mobxStore.appStore.location.action === 'POP'
    && _.mobxStore.screen.homeStore.init
  ) {
    return {};
  }
  await _.mobxStore.screen.homeStore.getList();
  // eslint-disable-next-line no-throw-literal
  return {};
};

export default pageWithTranslation()(withError(Index));
