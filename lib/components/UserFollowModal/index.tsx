import React, { useEffect, useState } from 'react';
import { rem } from 'polished';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { X } from '@lib/icon';
import { useWatchQuery } from '@lib/common/hooks/useWatchQuery';
import { FollowedUsers } from '@lib/schemas/query';
import { UserEntity } from '@lib/common/interfaces/user';
import { Modal, Avatar } from '..';
import { IconButton } from '../Button';
import { Loading } from '../Loading';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ModalContent = styled(Modal)`
  padding: 0 !important;
  max-width: ${rem(400)} !important;
  height: ${rem(500)};
  /* height: calc(100vh - ${rem(24 * 2)}) !important; */
  margin: ${rem(24)} auto !important;
  ${customMedia.lessThan('mobile')`
    height: 80vh !important;
    margin-top: 20vh !important;
    margin-bottom: 0 !important;
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  `}
`;


const Content = styled(OverlayScrollbarsComponent)`
  flex: 1;
  background-color: ${theme('colors.background')};
  /* max-height: 100%; */
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  border-bottom: 1px solid ${theme('colors.shadowColor')};
`;


const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;

const XButton = styled(X)`
  color: ${theme('colors.text')};
`;

export const UserFollowModal: React.FC<IProps> = ({ visible, onClose }) => {
  const [query] = useWatchQuery<{followedUsers: UserEntity[]}>(FollowedUsers, { fetchPolicy: 'network-only' });
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<UserEntity[]>([]);
  useEffect(() => {
    setLoading(true);
    query((data) => {
      setLoading(false);
      setUserList(data.followedUsers);
    }, {
      id: 9,
      limit: 30,
      offset: 0,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ModalContent
      visible={visible}
      onClose={onClose}
      closeIcon={false}
    >
      <Wrapper>
        <Header>
          <Title>关注的人</Title>
          <IconButton onClick={onClose}>
            <XButton />
          </IconButton>
        </Header>
        <Content
          options={{ scrollbars: { autoHide: 'leave' }, sizeAutoCapable: false }}
        >
          {
            loading ? (
              <Loading />
            ) : (
              <div>
                {
                  userList.map(user => (
                    <div key={user.id}>
                      <Avatar src={user.avatar} />
                      <span>{user.fullName}</span>
                    </div>
                  ))
                }
              </div>
            )
          }
        </Content>
      </Wrapper>
    </ModalContent>
  );
};
