import React from 'react';
import { css } from 'styled-components';
import { Bell } from '@lib/icon';
import { theme } from '@lib/common/utils/themes';
import { IconButton } from '@lib/components/Button';
import { useNotification } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { NotificationPopover } from '@lib/components/Notification';
import { Popover } from '@lib/components/Popover';

export const BellButton = observer(() => {
  const { unread } = useNotification();
  return (
    <Popover
      trigger="click"
      mobile
      placement="bottom-end"
      contentStyle={{ padding: 0 }}
      content={(
        <NotificationPopover />
      )}
    >
      <IconButton css={css`margin-right: 24px;position: relative;` as any}>
        <Bell />
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
      </IconButton>
    </Popover>
  );
});
