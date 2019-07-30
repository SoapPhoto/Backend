import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { UserEntity } from '@lib/common/interfaces/user';
import { Avatar } from '@lib/components';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserEntity;
}

const Wrapper = styled(Grid)`
  width: ${rem('200px')};
  padding: ${rem('14px')} ${rem('10px')};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const UserBox = styled.div`
  margin-left: ${rem('16px')};
`;

const UserName = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[3])};
  font-weight: 500;
  margin-bottom: ${rem('4px')};
`;

const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  font-weight: 400;
  color: ${_ => _.theme.colors.secondary}
`;

export default ({
  user,
  ...restProps
}: IProps) => (
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
