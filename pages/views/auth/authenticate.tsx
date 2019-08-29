import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { theme } from '@lib/common/utils/themes';
import Router, { withRouter } from 'next/router';
import { store } from '@lib/stores/init';
import Toast from '@lib/components/Toast';

import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { WithRouterProps } from 'next/dist/client/with-router';
import { connect } from '@lib/common/utils/store';
import { AccountStore } from '@lib/stores/AccountStore';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps extends IBaseScreenProps, WithRouterProps {
  accountStore: AccountStore;
}

const Wrapper = styled.div`
  text-align: center;
  font-size: ${_ => rem(theme('fontSizes[4]')(_))};
  margin-top: ${rem(24)};
`;

const Authenticate: React.FC<IProps> = ({ router, accountStore }) => {
  const { query } = router;
  const { refreshToken } = accountStore;
  const { t } = useTranslation();
  useEffect(() => {
    store.appStore.setLoading(true);
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  const refresh = useCallback(async () => {
    const redirectUrl = query.redirectUrl || '/';
    try {
      await refreshToken();
      window.location.href = query.redirectUrl as string;
    } catch (err) {
      console.error(err);
      Toast.error(t('authenticate.error_message'));
      setTimeout(() => {
        window.location.href = `/login?redirectUrl=${redirectUrl}`;
      }, 300);
    }
  }, [query.redirectUrl, refreshToken, t]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <Wrapper>{t('authentication user information')}</Wrapper>
  );
};

export default withRouter(connect('accountStore')(
  pageWithTranslation(I18nNamespace.Auth)(Authenticate),
));
