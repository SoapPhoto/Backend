import React, { useEffect } from 'react';
import { useNotification } from '@lib/stores/hooks';
import styled from 'styled-components';
import { rem } from 'polished';
import { NotificationItem } from './NotificationItem';

const Wrapper = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: ${rem(12)};
  width: ${rem(300)};
  padding: ${rem(24)};
  height: ${rem(200)};
`;

export const NotificationPopover = () => {
  const { getList, list } = useNotification();
  useEffect(() => {
    getList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Wrapper>
      {
        list.map(notify => (
          <NotificationItem key={notify.id} data={notify} />
        ))
      }
    </Wrapper>
  );
};
