import React, { useState, useRef } from 'react';

import { Popover } from '@lib/components/Popover';
import { UserEntity } from '@lib/common/interfaces/user';
import { getUserInfo } from '@lib/services/user';
import UserCard from './UserCard';

interface IProps {
  username: string;
}

export const UserPopper: React.FC<IProps> = ({
  children,
  username,
}) => {
  const [info, setInfo] = useState<UserEntity>();
  const popperRef = useRef<Popover>(null);
  const fetch = async () => {
    const { data } = await getUserInfo(username);
    setInfo(data);
    if (popperRef.current && popperRef.current.popper) {
      popperRef.current.popper.update();
    } else {
      setTimeout(() => {
        popperRef.current!.popper!.update();
      }, 10);
    }
  };
  const onOpen = () => {
    fetch();
  };
  return (
    <Popover
      openDelay={500}
      trigger="hover"
      onOpen={onOpen}
      placement="top"
      ref={popperRef}
      content={
        <UserCard user={info} />
      }
    >
      {children}
    </Popover>
  );
};
