import React, { useState, useRef } from 'react';

import { Popover } from '@lib/components/Popover';
import { UserEntity } from '@lib/common/interfaces/user';
import { getUserInfo } from '@lib/services/user';
import { connect } from '@lib/common/utils/store';
import { AppStore } from '@lib/stores/AppStore';
import UserCard from './UserCard';

interface IProps {
  username: string;
  appStore?: AppStore;
}

export const UserPopper = connect<React.FC<IProps>>('appStore')(({
  children,
  username,
  appStore,
}) => {
  const { userList } = appStore!;
  const [info, setInfo] = useState<UserEntity | undefined>(userList.get(username));
  const popperRef = useRef<Popover>(null);
  const fetch = async () => {
    const { data } = await getUserInfo(username);
    userList.set(username, data);
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
    if (userList.get(username)) setInfo(userList.get(username));
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
});
