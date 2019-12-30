import React from 'react';
import { observer } from 'mobx-react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureList } from '@lib/containers/Picture/List';
import { withError } from '@lib/components/withError';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { getTitle, server } from '@lib/common/utils';
import { useScreenStores, useAccountStore } from '@lib/stores/hooks';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { SEO, Nav, NavItem } from '@lib/components';

const Index: ICustomNextPage<IBaseScreenProps, {}> = observer(() => {
  const { t } = useTranslation();
  const { homeStore } = useScreenStores();
  const { isLogin } = useAccountStore();
  const {
    list, like, getPageList, isNoMore, restQuery,
  } = homeStore;
  return (
    <div>
      <SEO
        title={getTitle(`home.nav.${restQuery.type.toLocaleLowerCase()}`, t)}
        description="有趣的方式来和小伙伴分享你生活的照片。"
      />
      <Nav>
        {
          isLogin && (
            <NavItem route="/">
              {t('home.nav.feed')}
            </NavItem>
          )
        }
        <NavItem route={isLogin ? '/hot' : '/'}>
          {t('home.nav.hot')}
        </NavItem>
        <NavItem route="/new">
          {t('home.nav.new')}
        </NavItem>
        <NavItem route="/choice">
          {t('home.nav.choice')}
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

Index.getInitialProps = async ({ mobxStore, route, res }: ICustomNextContext) => {
  const { appStore, screen, accountStore } = mobxStore;
  const { params } = route;
  const { type } = params as Record<string, string>;
  const { homeStore } = screen;
  const { location } = appStore;
  const isPop = location && location.action === 'POP' && !server;
  let newType = (type || '').toLocaleLowerCase();
  if (!newType) {
    newType = accountStore.isLogin ? 'feed' : 'hot';
  }
  if (newType === 'feed' && !accountStore.isLogin && res) {
    res.redirect('/');
  }
  homeStore.setType(newType);
  if (isPop) {
    await homeStore.getListCache();
  } else {
    await homeStore.getList(false);
  }
  // eslint-disable-next-line no-throw-literal
  return {};
};

export default pageWithTranslation(I18nNamespace.User)(withError(Index));
