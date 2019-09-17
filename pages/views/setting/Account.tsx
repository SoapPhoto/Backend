import React, {
  useEffect, useCallback, useState, useRef,
} from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import qs from 'querystring';

import { useTranslation } from '@lib/i18n/useTranslation';
import { accountRevoke, accountAuthorize } from '@lib/services/credentials';
import { CredentialsType, CredentialsTypeValues } from '@common/enum/credentials';
import { theme } from '@lib/common/utils/themes';
import { Button } from '@lib/components/Button';
import { Lock, Unlock } from '@lib/icon';
import { CredentialsEntity } from '@lib/common/interfaces/credentials';
import { Confirm } from '@lib/components/Confirm';
import Toast from '@lib/components/Toast';
import { oauthOpen } from '@lib/common/utils/oauth';
import { OauthStateType } from '@common/enum/oauthState';
import { useAccountStore } from '@lib/stores/hooks';
import { useComputed } from 'mobx-react-lite';
import { observer } from 'mobx-react';

interface IInfo {
  title: string;
}

const Title = styled.h2`
  font-weight: 400;
  margin-bottom: ${rem(24)};
`;

const List = styled.div`
  display: grid;
  grid-gap: ${rem(12)};
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const InfoTitle = styled.h3`
  font-size: ${theme('fontSizes[2]')};
`;

const InfoName = styled.h4`
  font-size: ${theme('fontSizes[1]')};
  text-align: center;
`;

const CredentialInfo: Record<CredentialsType, IInfo> = {
  [CredentialsType.GITHUB]: {
    title: 'Github',
  },
  [CredentialsType.GOOGLE]: {
    title: 'Google',
  },
};

const Account = observer(() => {
  const { t } = useTranslation();
  const { userCredentials, getCredentials } = useAccountStore();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const [currentId, setCurrentId] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const crData = useComputed(
    () => {
      const newData: RecordPartial<CredentialsType, CredentialsEntity> = {};
      userCredentials.forEach(v => newData[v.type] = v);
      return newData;
    },
    [userCredentials],
  );
  useEffect(() => {
    getCredentials();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revokeConfirm = useCallback((id: string) => {
    setCurrentId(id);
    setConfirmVisible(true);
  }, []);
  const revoke = useCallback(async () => {
    setConfirmLoading(true);
    setConfirmDisabled(true);
    try {
      await accountRevoke(currentId);
      Toast.success('解绑成功!');
      setConfirmVisible(false);
      getCredentials();
    } catch {
      Toast.error('解绑失败');
      getCredentials();
    } finally {
      setConfirmLoading(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        setConfirmDisabled(false);
      }, 1000);
    }
  }, [currentId, getCredentials]);
  const messageCb = useCallback(async (e: MessageEvent) => {
    if (e.origin === window.location.origin) {
      if (e.data.fromOauthWindow) {
        const data = qs.parse(e.data.fromOauthWindow.substr(1));
        if (data.code && !data.message) {
          window.postMessage({ fromParent: true }, window.location.href);
          const query = qs.parse(e.data.fromOauthWindow.substr(1));
          await accountAuthorize(query as any);
          getCredentials();
          Toast.success('绑定成功！');
        } else {
          setTimeout(() => window.postMessage({ fromParent: true }, window.location.href), 1000);
        }
      }
    }
  }, [getCredentials]);
  const authorize = useCallback(() => {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const cb = `${process.env.URL}/oauth/github/redirect`;
    const github = 'https://github.com/login/oauth/authorize';
    const url = `${github}?client_id=${clientId}&state=${OauthStateType.authorize}&redirect_uri=${cb}`;

    oauthOpen(url);
    window.addEventListener('message', messageCb);
    return () => window.removeEventListener('message', messageCb);
  }, [messageCb]);
  return (
    <div>
      <Title>{t('setting_menu.account')}</Title>
      <List>
        {
          CredentialsTypeValues.map((type) => {
            const data = CredentialInfo[type];
            const currentInfo = crData[type];
            return (
              <Item key={type}>
                <ItemInfo>
                  <InfoTitle>{data.title}</InfoTitle>
                </ItemInfo>
                <div>
                  {
                    currentInfo ? (
                      <>
                        <InfoName>{currentInfo.info.login}</InfoName>
                        <Button text danger onClick={() => revokeConfirm(currentInfo.id)}>
                          解绑
                        </Button>
                      </>
                    ) : (
                      <Button text onClick={() => authorize()}>
                        <Lock size={14} />
                        绑定
                      </Button>
                    )
                  }
                </div>
              </Item>
            );
          })
        }
      </List>
      <Confirm
        title="确定解绑吗？"
        visible={confirmVisible}
        confirmText="解绑"
        confirmProps={{
          disabled: confirmDisabled,
          danger: true,
          onClick: revoke,
        }}
        confirmLoading={confirmLoading}
        confirmIcon={<Unlock size={14} />}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
});

export default Account;
