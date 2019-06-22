import React from 'react';

import { connect } from '@pages/common/utils/store';
import { Smile } from '@pages/icon';
import { AccountStore } from '@pages/stores/AccountStore';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Input } from '../Input';
import { HandleBox, Wrapper } from './styles/editor';

interface IProps {
  accountStore?: AccountStore;
}

export const CommentEditor = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
}) => {
  const { userInfo } = accountStore!;
  return (
    <Wrapper>
      <Avatar src={userInfo!.avatar} />
      <div>
        <Input />
        <HandleBox>
          <Smile />
          <Button>评论</Button>
        </HandleBox>
      </div>
    </Wrapper>
  );
});
