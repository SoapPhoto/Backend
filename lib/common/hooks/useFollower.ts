import { useApolloClient } from 'react-apollo';
import { throttle } from 'lodash';
import { useState, useCallback } from 'react';

import { UserIsFollowing, Whoami } from '@lib/schemas/query';
import { FollowUser, UnFollowUser } from '@lib/schemas/mutations';
import { useAccountStore } from '@lib/stores/hooks';
import Toast from '@lib/components/Toast';
import { useWatchQuery } from './useWatchQuery';
import { UserEntity } from '../interfaces/user';

export function useFollower(): [(user: UserEntity) => Promise<void>, boolean] {
  const { mutate } = useApolloClient();
  const { userInfo } = useAccountStore();
  const [followLoading, setFollowLoading] = useState(false);
  const [query] = useWatchQuery<{ user: { isFollowing: number } }>(UserIsFollowing, { fetchPolicy: 'network-only' });
  const [whoamiQuery] = useWatchQuery<{ user: { isFollowing: number } }>(Whoami, { fetchPolicy: 'network-only' });
  const follow = useCallback(throttle(async (user: UserEntity) => {
    if (!userInfo) {
      Toast.warning('请登录！');
      return;
    }
    if (followLoading) return;
    let mutation = FollowUser;
    if (user.isFollowing > 0) mutation = UnFollowUser;
    setFollowLoading(true);
    try {
      await mutate<{ done: boolean }>({
        mutation,
        variables: {
          input: {
            userId: user.id,
          },
        },
      });
      await Promise.all([
        query(() => {
          setFollowLoading(false);
        }, {
          username: user.username,
        }),
        whoamiQuery(_data => undefined),
      ]);
    } catch (error) {
      if (error?.graphQLErrors[0]?.message.message === 'followed') {
        await query(() => {
          setFollowLoading(false);
        }, {
          username: user.username,
        });
      } else {
        setFollowLoading(false);
      }
    }
  }, 1000), []);
  return [follow, followLoading];
}
