import React, { ReactElement } from 'react';

import styled from 'styled-components';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';
import { HelpCircle } from '@lib/icon';
import { useTranslation } from '@lib/i18n/useTranslation';
import { customBreakpoints } from '@lib/common/utils/mediaQuery';
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

const HelpIcon = styled(HelpCircle)`
  margin-right: ${rem(24)};
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
    <Modal visible={visible} onClose={onClose} boxStyle={{ maxWidth: customBreakpoints.small }}>
      <Content>
        <HelpIcon />
        <div>
          <Title>{title}</Title>
        </div>
      </Content>
      <Btns>
        <Button
          text
          style={{ marginRight: rem(12) }}
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
