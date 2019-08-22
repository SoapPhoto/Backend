import React, { useEffect } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { theme } from '@lib/common/utils/themes';
import Router, { withRouter } from 'next/router';
import { store } from '@lib/stores/init';
import Toast from '@lib/components/Toast';

import moment from 'moment';
import { oauthToken } from '@lib/services/oauth';
import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { WithRouterProps } from 'next/dist/client/with-router';
import { ParsedUrlQuery } from 'querystring';

interface IProps extends IBaseScreenProps, WithRouterProps {
}

const Wrapper = styled.div`
  text-align: center;
  font-size: ${_ => rem(theme('fontSizes[4]')(_))};
  margin-top: ${rem(24)};
`;

const refreshToken = async ({ redirectUrl = '/' }: ParsedUrlQuery) => {
  try {
    const token = JSON.parse(localStorage.getItem('token') || 'null');
    if (token && token.refreshTokenExpiresAt && moment(token.refreshTokenExpiresAt) > moment()) {
      const params = new URLSearchParams();
      params.append('refresh_token', token.refreshToken);
      params.append('grant_type', 'refresh_token');
      const { data } = await oauthToken(params);
      localStorage.setItem('token', JSON.stringify(data));
      Toast.success('登录成功！正在跳转');
      setTimeout(() => {
        window.location.href = redirectUrl as string;
      }, 300);
    }
  } catch (_) {
    Toast.error('认证失败，正在返回登录页重新登录');
    setTimeout(() => {
      window.location.href = `/login?redirectUrl=${redirectUrl}`;
    }, 300);
  }
};

const Authenticate: React.FC<IProps> = ({ router }) => {
  useEffect(() => {
    store.appStore.setLoading(true);
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  useEffect(() => {
    refreshToken(router.query);
  }, []);
  return (
    <Wrapper>认证用户信息中...</Wrapper>
  );
};

export default withRouter(Authenticate);
