import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useEffect } from 'react';

import { LoginSchema } from '@lib/common/dto/auth';
import { getTitle } from '@lib/common/utils';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import {
  Title, Wrapper, OauthIcon, Header, SubTitle,
} from '@lib/styles/views/auth';
import rem from 'polished/lib/helpers/rem';
import styled from 'styled-components';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { useRouter } from '@lib/router';
import { withError } from '@lib/components/withError';
import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { GitHubLogo } from '@lib/icon';
import {
  oauthOpen, getOauthUrl, oauthSuccess, IOauthSuccessData,
} from '@lib/common/utils/oauth';
import { OauthType } from '@common/enum/router';
import { OauthStateType, OauthActionType } from '@common/enum/oauthState';
import { EmojiText, SEO } from '@lib/components';
import { Popover } from '@lib/components/Popover';
import { A } from '@lib/components/A';
import { Weibo } from '@lib/icon/Weibo';

interface IValues {
  username: string;
  password: string;
}

const Handle = styled.div`
  margin-top: ${rem(24)};
  width: 100%;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, ${rem(32)});
`;

const Login: React.FC<IBaseScreenProps> = () => {
  const { query, replaceRoute } = useRouter();
  const { login, codeLogin } = useAccountStore();
  const { t } = useTranslation();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const push = useCallback(() => {
    if (query.redirectUrl) {
      window.location = query.redirectUrl as any;
    } else {
      window.location = '/' as any;
    }
  }, [query.redirectUrl]);
  const handleOk = async (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    (async () => {
      setConfirmLoading(true);
      setSubmitting(false);
      try {
        await login(value.username, value.password);
        setSubmitting(true);
        setTimeout(async () => {
          push();
        }, 400);
        Toast.success(t('auth.message.login_successful'));
      } catch (error) {
        setSubmitting(false);
        Toast.error(t(error.message));
      } finally {
        setConfirmLoading(false);
      }
    })();
  };
  const getInfo = useCallback(async (data: IOauthSuccessData) => {
    try {
      if (data.action === OauthActionType.active) {
        replaceRoute(`/auth/complete?code=${data.code}`);
      } else {
        await codeLogin(data.code!, data.type!);
        setTimeout(() => {
          push();
        }, 400);
        Toast.success(t('auth.message.login_successful'));
      }
    } catch (error) {
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  }, [codeLogin, push, replaceRoute, t]);
  const messageCb = useCallback((e: MessageEvent) => {
    oauthSuccess(e, getInfo, () => window.removeEventListener('message', messageCb));
  }, [getInfo]);
  const oauth = useCallback((type: OauthType) => {
    oauthOpen(getOauthUrl(type, OauthStateType.login));
    window.addEventListener('message', messageCb);
    return () => window.removeEventListener('message', messageCb);
  }, [messageCb]);
  useEffect(() => () => window.removeEventListener('message', messageCb), [messageCb]);
  return (
    <Wrapper>
      <SEO
        title={getTitle('menu.login', t)}
        description="登录 Soap 分享创造你的生活给你的小伙伴。"
      />
      <Header>
        <Title>
          <EmojiText
            text={t('auth.title.login')}
          />
        </Title>
        <SubTitle>
          新用户？
          <A route="/signup">创建账户</A>
        </SubTitle>
      </Header>
      <Formik<IValues>
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={handleOk}
        validationSchema={LoginSchema(t)}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <FieldInput
              name="username"
              label={t('label.username')}
            />
            <FieldInput
              type="password"
              name="password"
              label={t('label.password')}
              style={{ marginTop: rem(24) }}
            />
            <Button
              loading={confirmLoading}
              style={{ marginTop: rem(42), width: '100%' }}
              type="submit"
              disabled={isSubmitting}
            >
              {t('auth.btn.login')}
            </Button>
            <Handle>
              <Popover
                openDelay={100}
                trigger="hover"
                placement="top"
                theme="dark"
                content={<span>使用 GITHUB 账号登录</span>}
              >
                <span>
                  <OauthIcon
                    type="button"
                    style={{ backgroundColor: '#24292e' }}
                    onClick={() => oauth(OauthType.GITHUB)}
                  >
                    <GitHubLogo color="#fff" size={18} />
                  </OauthIcon>
                </span>
              </Popover>
              <OauthIcon
                type="button"
                style={{ backgroundColor: '#ffda5d' }}
                onClick={() => oauth(OauthType.WEIBO)}
              >
                <Weibo size={18} />
              </OauthIcon>
            </Handle>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withAuth('guest')(
  withError(pageWithTranslation(I18nNamespace.Auth)(Login)),
);
