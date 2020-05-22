import React, { useEffect, useState } from 'react';
import { rem } from 'polished';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { X, StrutAlign, BadgeCert } from '@lib/icon';
import { useWatchQuery } from '@lib/common/hooks/useWatchQuery';
import { FollowedUsers, FollowerUsers } from '@lib/schemas/query';
import { UserEntity } from '@lib/common/interfaces/user';
import { useFollower } from '@lib/common/hooks/useFollower';
import { observer } from 'mobx-react';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Modal, Avatar, EmojiText } from '..';
import { IconButton } from '../Button';
import { Loading } from '../Loading';
import { FollowButton } from '../Button/FollowButton';
import { Popover } from '../Popover';
import { A } from '../A';

interface IProps {
  visible: boolean;
  onClose: () => void;
  type: string;
  userId: number;
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

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${rem(16)};
`;

const Info = styled.div`
  margin-left: ${rem(8)};
  flex: 1;
  overflow: hidden;
`;

const Username = styled.span`
  font-weight: 500;
  color: ${theme('colors.text')};
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Bio = styled.p`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: ${rem(4)};
`;

const Follow = styled(FollowButton)`
  margin-left: ${rem(8)};
`;

const LoadingBox = styled.div`
  height: 100%;
  display: flex;
`;

export const UserFollowModal = observer<React.FC<IProps>>(({
  visible, onClose, type, userId,
}) => {
  const { t } = useTranslation();
  const [followedQuery] = useWatchQuery<{followedUsers: UserEntity[]}>(FollowedUsers);
  const [followerQuery] = useWatchQuery<{followerUsers: UserEntity[]}>(FollowerUsers);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<UserEntity[]>([]);
  const [follow, followLoading] = useFollower();
  useEffect(() => {
    if (visible !== true) return;
    setLoading(true);
    let query: any = followedQuery;
    if (type === 'follower') query = followerQuery;
    const watch = query((data: any) => {
      setLoading(false);
      setUserList(data[`${type}Users` as any]);
    }, {
      id: userId,
      limit: 30,
      offset: 0,
    });
    const clear = watch((data: any) => {
      if (data[`${type}Users` as any]) {
        setUserList(data[`${type}Users` as any]);
      }
    });
    // eslint-disable-next-line consistent-return
    return () => clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const title = type === 'follower' ? t('user.label.followers') : t('user.label.followed');
  return (
    <ModalContent
      visible={visible}
      onClose={onClose}
      closeIcon={false}
    >
      <Wrapper>
        <Header>
          <Title>{title}</Title>
          <IconButton onClick={onClose}>
            <XButton />
          </IconButton>
        </Header>
        <Content
          options={{ scrollbars: { autoHide: 'move' }, sizeAutoCapable: false }}
        >
          {
            loading ? (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            ) : (
              <div>
                {
                  userList.map(user => (
                    <UserItem key={user.id}>
                      <Avatar size={42} src={user.avatar} />
                      <Info>
                        <p>

                          <A
                            route={`/@${user.username}`}
                          >
                            <Username>
                              <EmojiText
                                text={user.fullName}
                              />
                              {
                                user.badge.find(v => v.name === 'user-cert') && (
                                  <StrutAlign>
                                    <Popover
                                      openDelay={100}
                                      trigger="hover"
                                      placement="top"
                                      theme="dark"
                                      content={<span>认证用户</span>}
                                    >
                                      <BadgeCert size={16} style={{ marginLeft: rem(4) }} />
                                    </Popover>
                                  </StrutAlign>
                                )
                              }
                            </Username>
                          </A>
                        </p>
                        {
                          user.bio && (
                            <Bio title={user.bio}>{user.bio}</Bio>
                          )
                        }
                      </Info>
                      <Follow
                        isFollowing={user.isFollowing}
                        size="small"
                        user={user}
                        disabled={followLoading}
                        onClick={() => follow(user)}
                      />
                    </UserItem>
                  ))
                }
              </div>
            )
          }
        </Content>
      </Wrapper>
    </ModalContent>
  );
});
