import React, { useEffect } from 'react';
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
  useEffect(() => {
    store.appStore.setLoading(true);
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  useEffect(() => {
    refreshToken((err?: any) => {
      const redirectUrl = query.redirectUrl || '/';
      if (err) {
        Toast.success('登录成功！正在跳转');
        setTimeout(() => {
          window.location.href = query.redirectUrl as string;
        }, 300);
      } else {
        Toast.error('认证失败，正在返回登录页重新登录');
        setTimeout(() => {
          window.location.href = `/login?redirectUrl=${redirectUrl}`;
        }, 300);
      }
    });
  }, []);
  return (
    <Wrapper>认证用户信息中...</Wrapper>
  );
};

export default withRouter(connect('accountStore')(Authenticate));
