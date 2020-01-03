import React, { useRef, useCallback } from 'react';
import { useLazyQuery } from 'react-apollo';

import { Popover } from '@lib/components/Popover';
import { UserEntity } from '@lib/common/interfaces/user';
import { UserInfo } from '@lib/schemas/query';
import UserCard from './UserCard';

interface IProps {
  username: string;
}

export const UserPopper: React.FC<IProps> = ({
  children,
  username,
}) => {
  const popperRef = useRef<Popover>(null);
  const [loadUser, { loading, data }] = useLazyQuery<{user: UserEntity}>(UserInfo);
  const onOpen = useCallback(() => {
    loadUser({
      variables: {
        username,
      },
    });
  }, [loadUser, username]);
  return (
    <Popover
      contentStyle={{ padding: 0 }}
      openDelay={500}
      trigger="hover"
      onOpen={onOpen}
      placement="top"
      ref={popperRef}
      content={
        <UserCard user={(loading || !data) ? undefined : data.user} />
      }
    >
      {children}
    </Popover>
  );
};
