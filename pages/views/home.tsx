import React from 'react';
import { observer } from 'mobx-react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureList } from '@lib/containers/Picture/List';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { getTitle, server } from '@lib/common/utils';
import { useScreenStores } from '@lib/stores/hooks';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { SEO, Nav, NavItem } from '@lib/components';

const Index: ICustomNextPage<IBaseScreenProps, {}> = observer(() => {
  const { t } = useTranslation();
  const { homeStore } = useScreenStores();
  const {
    list, like, getPageList, isNoMore,
  } = homeStore;
  return (
    <div>
      <SEO
        title={getTitle('title.home', t)}
        description="有趣的方式来和小伙伴分享你生活的照片。"
      />
      <Nav>
        <NavItem route="/">
          {t('home.nav.hot')}
        </NavItem>
        <NavItem route="/new">
          {t('home.nav.new')}
        </NavItem>
      </Nav>
      <PictureList
        noMore={isNoMore}
        onPage={getPageList}
        like={like}
        data={list}
      />
    </div>
  );
});

Index.getInitialProps = async ({ mobxStore, route }: ICustomNextContext) => {
  const { appStore, screen } = mobxStore;
  const { params } = route;
  const { type } = params as Record<string, string>;
  const { homeStore } = screen;
  const { location } = appStore;
  const isPop = location && location.action === 'POP' && !server;
  homeStore.setType(type);
  if (isPop) {
    await homeStore.getListCache();
  } else {
    await homeStore.getList(false);
  }
  // eslint-disable-next-line no-throw-literal
  return {};
};

export default pageWithTranslation(I18nNamespace.User)(withError(Index));
