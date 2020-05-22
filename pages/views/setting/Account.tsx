import React, {
  useEffect, useCallback, useState, useRef, useMemo,
} from 'react';
import styled, { css } from 'styled-components';
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
import { observer } from 'mobx-react';
import { OauthType, OauthTypeValues } from '@common/enum/router';
import { IGoogleUserInfo, IGithubUserInfo, IOauthUserInfo } from '@lib/common/interfaces/user';
import { SignupType } from '@common/enum/signupType';

interface IInfo {
  title: string;
}

const Title = styled.h2`
  font-weight: 600;
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
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
`;

const InfoTip = styled.span`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  font-weight: 400;
  margin-left: ${rem(12)};
  color: ${theme('colors.secondary')};
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
  [OauthType.WEIBO]: {
    title: '微博',
  },
};

function oauthInfoName(type: OauthType, info: IOauthUserInfo) {
  if (type === OauthType.GITHUB) {
    return (info as IGithubUserInfo).login;
  }
  if (type === OauthType.GOOGLE) {
    return (info as IGoogleUserInfo).email;
  }
  if (type === OauthType.WEIBO) {
    return (info as IGoogleUserInfo).name;
  }
  return '';
}


const Account = observer(() => {
  const { t } = useTranslation();
  const { userInfo } = useAccountStore();
  const { userCredentials, getCredentials } = useAccountStore();
  const timer = useRef<number>();
  const [currentId, setCurrentId] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const crData = useMemo(
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
      Toast.success(t('setting.account.message.revoke_success'));
      setConfirmVisible(false);
      getCredentials();
    } catch (err) {
      if (err?.response?.data?.message === 'reserved login type') {
        Toast.error(t('setting.account.message.require_one_login_type'));
      } else {
        Toast.error(t('setting.account.message.revoke_error'));
      }
      getCredentials();
    } finally {
      setConfirmLoading(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        setConfirmDisabled(false);
      }, 1000);
    }
  }, [currentId, getCredentials, t]);
  const accountService = useCallback(async (data: IOauthSuccessData) => {
    await accountAuthorize({
      code: data.code!,
    });
    getCredentials();
    Toast.success(t('setting.account.message.authorize_success'));
  }, [getCredentials, t]);
  const messageCb = useCallback(async (e: MessageEvent) => {
    oauthSuccess(e, accountService, () => window.removeEventListener('message', messageCb));
  }, [accountService]);
  const authorize = useCallback((type: OauthType) => {
    if (type === OauthType.GOOGLE) {
      Toast.warning(t('setting.account.message.google_disabled'));
      return;
    }
    oauthOpen(getOauthUrl(type, OauthStateType.authorize));
    window.addEventListener('message', messageCb);
  }, [messageCb, t]);
  return (
    <div>
      <Title>{t('setting.menu.account')}</Title>
      <List>
        {
          OauthTypeValues.map((type: OauthType) => {
            const data = CredentialInfo[type];
            const currentInfo = crData[type];
            return (
              <Item key={type}>
                <ItemInfo>
                  <InfoTitle>
                    {data.title}
                    {
                      userInfo!.signupType === type as any && (
                        <InfoTip>
                          {`(${t('setting.account.label.signup_type')})`}
                        </InfoTip>
                      )
                    }
                  </InfoTitle>
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
                      <Button disabled={type === OauthType.GOOGLE} shape="round" size="small" onClick={() => authorize(type)}>
                        {t('setting.account.btn.authorize')}
                      </Button>
                    )
                  }
                </div>
              </Item>
            );
          })
        }
        <Item>
          <ItemInfo>
            <InfoTitle>
              {t('label.email')}
              {
                userInfo!.signupType === SignupType.EMAIL && (
                  <InfoTip>
                    {` (${t('setting.account.label.signup_type')})`}
                  </InfoTip>
                )
              }
            </InfoTitle>
          </ItemInfo>
          <div>
            {
              userInfo!.email ? (
                <CrInfo>
                  <InfoName style={{ marginRight: rem(12) }}>
                    {userInfo!.email}
                    {
                      !userInfo!.isEmailVerified && (
                        <span css={css`
                          font-size: 12px;
                          margin-left: 4px;
                          color: ${theme('colors.danger')};
                        `}
                        >
                          {`(${t('setting.account.label.no_verify')})`}
                        </span>
                      )
                    }
                  </InfoName>
                  <Button disabled shape="round" danger size="small">
                    {`${t('setting.account.btn.modify')}`}
                  </Button>
                </CrInfo>
              ) : (
                <Button disabled shape="round" size="small">
                  {`${t('setting.account.btn.authorize')}`}
                </Button>
              )
            }
          </div>
        </Item>
      </List>
      <Confirm
        title={t('setting.account.revoke_confirm.title')}
        visible={confirmVisible}
        confirmText={t('setting.account.label.revoke')}
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
