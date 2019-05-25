import React from 'react';
import styled from 'styled-components';

import { UserEntity } from '@pages/common/interfaces/user';
import { Avatar } from '@pages/components';
import { Cell, Grid } from 'styled-css-grid';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserEntity;
}

const Wrapper = styled(Grid)`
  width: 200px;
  padding: 14px 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const UserBox = styled.div`
  margin-left: 16px;
`;

const UserName = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Bio = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: ${_ => _.theme.colors.secondary}
`;

export default ({
  user,
  ...restProps
}: IProps) => {
  return (
    <div {...restProps}>
      <Wrapper columns={1}>
        <Header>
          <Avatar src={user.avatar} size={48} />
          <UserBox>
            <UserName>{user.username}</UserName>
            <Bio>{user.bio}</Bio>
          </UserBox>
        </Header>
      </Wrapper>
    </div>
  );
};
