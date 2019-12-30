import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { observer } from 'mobx-react';
// import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { useNotification } from '@lib/stores/hooks';
import { NotificationItem } from './NotificationItem';
import { Empty } from '../Empty';

const Wrapper = styled.div`
  width: ${rem(380)};
  /* height: 200px;
  overflow: auto; */
  /* display: grid;
  grid-auto-rows: max-content;
  grid-gap: ${rem(12)}; */
`;

const List = styled(OverlayScrollbarsComponent)`
  max-height: ${rem(280)};
`;

const ListBox = styled.div`
  display: grid;
  grid-template-rows: max-content;
`;

export const NotificationPopover = observer(() => {
  const {
    getList, list, loading, listInit, unReadAll, watch,
  } = useNotification();
  const [init, setInit] = useState(false);
  useEffect(() => {
    if (!listInit) getList();
    setInit(true);
    const clear = watch();
    return () => {
      unReadAll();
      clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Wrapper>
      <List
        options={{ scrollbars: { autoHide: 'move' } }}
      >
        <ListBox>
          {
            init && (
              list.map(notify => (
                <NotificationItem key={notify.id} data={notify} />
              ))
            )
          }
          {
            list.length === 0 && (
              <Empty size="small" loading={loading} />
            )
          }
        </ListBox>
      </List>
    </Wrapper>
  );
});
