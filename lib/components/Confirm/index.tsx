import React, { ReactElement } from 'react';

import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';
import { HelpCircle } from '@lib/icon';
import { defaultBreakpoints } from 'styled-media-query';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Modal, IModalProps } from '../Modal';
import { Button, IButtonProps } from '../Button';

interface IConfirmProps extends IModalProps {
  title: string;
  confirmLoading?: boolean;
  confirmText?: string;
  confirmIcon?: ReactElement;
  confirmProps?: IButtonProps;
  cancelText?: string;
  cancelProps?: IButtonProps;
}

const Title = styled.span`
  font-weight: 500;
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
  line-height: 1.4;
`;

const Content = styled.div`
  display: flex;
`;

const Btns = styled.div`
  text-align: right;
  margin-top: ${rem(32)};
`;

export const Confirm: React.FC<IConfirmProps> = ({
  visible,
  onClose,
  title,
  cancelText,
  cancelProps = {},
  confirmIcon,
  confirmProps = {},
  confirmText,
  confirmLoading,
}) => {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} onClose={onClose} boxStyle={{ maxWidth: defaultBreakpoints.small }}>
      <Content>
        <HelpCircle css={css`margin-right: ${rem(24)};`} />
        <div>
          <Title>{title}</Title>
        </div>
      </Content>
      <Btns>
        <Button
          text
          css={css`margin-right: ${rem(12)};`}
          {...cancelProps}
          onClick={onClose}
        >
          {cancelText || t('cancel')}
        </Button>
        <Button {...confirmProps} loading={confirmLoading}>
          {confirmIcon}
          {confirmText || t('ok')}
        </Button>
      </Btns>
    </Modal>
  );
};
