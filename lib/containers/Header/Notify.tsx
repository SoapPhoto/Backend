import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Bell } from '@lib/icon';
import { theme } from '@lib/common/utils/themes';
import { IconButton } from '@lib/components/Button';
import { useNotification } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { NotificationPopover } from '@lib/components/Notification';
import { Popover } from '@lib/components/Popover';
import { useRouter } from '@lib/router';

const ButtonBox = styled.div`
  position: relative;
  margin-right: 24px;
  font-size: 0;
`;

const Button = styled(IconButton)`
  color: ${theme('colors.text')};
`;

export const Notify: React.FC = observer(() => {
  const { unread } = useNotification();
  const notifyRef = React.useRef<Popover>(null);
  const { pathname } = useRouter();
  useEffect(() => {
    if (notifyRef.current) notifyRef.current.close();
  }, [pathname]);
  return (
    <Popover
      trigger="click"
      mobile
      ref={notifyRef}
      placement="bottom-end"
      contentStyle={{ padding: 0 }}
      content={(
        <NotificationPopover />
      )}
    >
      <ButtonBox>
        <Button>
          <Bell />
        </Button>
        {
          unread > 0 && (
            <div
              css={css`
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${theme('colors.danger')};
                border-radius: 50%;
                right: -4px;
                top: -4px;
              `}
            />
          )
        }
      </ButtonBox>
    </Popover>
  );
});
