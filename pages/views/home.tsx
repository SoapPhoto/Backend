import React from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureList } from '@lib/containers/Picture/List';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { getTitle, server } from '@lib/common/utils';
import { useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { SEO } from '@lib/components';

const Index: ICustomNextPage<IBaseScreenProps, {}> = observer(() => {
  const { t } = useTranslation();
  const { homeStore } = useScreenStores();
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;
  return (
    <div>
      <SEO
        title={getTitle('home', t)}
        description="有趣的方式来和小伙伴分享你生活的照片。"
      />
      <PictureList noMore={isNoMore} onPage={getPageList} like={like} data={list} />
    </div>
  );
});

Index.getInitialProps = async ({ mobxStore }: ICustomNextContext) => {
  const { appStore, screen } = mobxStore;
  const { homeStore } = screen;
  const { location } = appStore;
  const isPop = location && location.action === 'POP' && !server;
  if (isPop) {
    await homeStore.getCache();
  } else {
    await homeStore.getList();
  }
  // eslint-disable-next-line no-throw-literal
  return {};
};

export default pageWithTranslation()(withError(Index));
