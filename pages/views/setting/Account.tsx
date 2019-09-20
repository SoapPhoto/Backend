import React, {
  useEffect, useCallback, useState, useRef,
} from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { useTranslation } from '@lib/i18n/useTranslation';
import { accountRevoke, accountAuthorize } from '@lib/services/credentials';
import { theme } from '@lib/common/utils/themes';
import { Button } from '@lib/components/Button';
import { Unlock, X } from '@lib/icon';
import { CredentialsEntity } from '@lib/common/interfaces/credentials';
import { Confirm } from '@lib/components/Confirm';
import Toast from '@lib/components/Toast';
import {
  oauthOpen, getOauthUrl, IOauthSuccessData, oauthSuccess,
} from '@lib/common/utils/oauth';
import { OauthStateType } from '@common/enum/oauthState';
import { useAccountStore } from '@lib/stores/hooks';
import { useComputed } from 'mobx-react-lite';
import { observer } from 'mobx-react';
import { OauthType, OauthTypeValues } from '@common/enum/router';
import { IGoogleUserInfo, IGithubUserInfo } from '@lib/common/interfaces/user';

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
  padding: ${rem(6)} 0;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const InfoTitle = styled.h3`
  font-size: ${theme('fontSizes[2]')};
`;

const CrInfo = styled.div`
  display: flex;
  align-items: center;
`;

const InfoName = styled.h4`
  color: ${theme('colors.secondary')};
  text-align: center;
`;

const CredentialInfo: Record<OauthType, IInfo> = {
  [OauthType.GITHUB]: {
    title: 'Github',
  },
  [OauthType.GOOGLE]: {
    title: 'Google',
  },
};

function oauthInfoName(type: OauthType, info: IGithubUserInfo | IGoogleUserInfo) {
  if (type === OauthType.GITHUB) {
    return (info as IGithubUserInfo).login;
  }
  if (type === OauthType.GOOGLE) {
    return (info as IGoogleUserInfo).email;
  }
  return '';
}

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
      const newData: RecordPartial<OauthType, CredentialsEntity> = {};
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
  const accountService = useCallback(async (data: IOauthSuccessData) => {
    await accountAuthorize({
      code: data.code!,
    });
    getCredentials();
    Toast.success('绑定成功！');
  }, [getCredentials]);
  const messageCb = useCallback(async (e: MessageEvent) => {
    oauthSuccess(e, accountService, () => window.removeEventListener('message', messageCb));
  }, [accountService]);
  const authorize = useCallback((type: OauthType) => {
    if (type !== OauthType.GOOGLE) {
      oauthOpen(getOauthUrl(type, OauthStateType.authorize));
      window.addEventListener('message', messageCb);
    } else {
      Toast.warning('Google 暂不可用!');
    }
  }, [messageCb]);
  return (
    <div>
      <Title>{t('setting_menu.account')}</Title>
      <List>
        {
          OauthTypeValues.map((type) => {
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
                      <CrInfo>
                        <InfoName style={{ marginRight: rem(12) }}>
                          @
                          {oauthInfoName(type, currentInfo.info!)}
                        </InfoName>
                        <Button danger shape="circle" size="small" onClick={() => revokeConfirm(currentInfo.id)}>
                          <X size={14} />
                        </Button>
                      </CrInfo>
                    ) : (
                      <Button shape="round" size="small" onClick={() => authorize(type)}>
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
