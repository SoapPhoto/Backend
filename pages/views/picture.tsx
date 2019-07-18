import Head from 'next/Head';
import React, { useEffect } from 'react';

import { CustomNextContext, CustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { Avatar, GpsImage } from '@lib/components';
import { Comment } from '@lib/components/Comment';
import { PictureInfo } from '@lib/components/PictureInfo';
import { Tag } from '@lib/components/Tag';
import { withError } from '@lib/components/withError';
import { PictureImage } from '@lib/containers/Picture/Image';
import { Eye, Heart } from '@lib/icon';
import { Link } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { IMyMobxStore } from '@lib/stores/init';
import { PictureScreenStore } from '@lib/stores/screen/Picture';
import { ThemeStore } from '@lib/stores/ThemeStore';
import {
  BaseInfoItem,
  Bio,
  Content,
  GpsCotent,
  PictureBox,
  TagBox,
  Title,
  UserHeader,
  UserHeaderInfo,
  UserInfo,
  UserLink,
  UserName,
  Wrapper,
} from '@lib/styles/views/picture';
import { Cell } from 'styled-css-grid';

interface InitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
  themeStore: ThemeStore;
  pictureStore: PictureScreenStore;
}

const Picture: CustomNextPage<IProps, any> = ({
  pictureStore,
}) => {
  const { info, like, getComment, comment, addComment } = pictureStore;
  const { user, tags } = info;

  useEffect(() => {
    getComment();
  }, []);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string) => {
    await addComment(value);
  };
  return (
    <Wrapper>
      <Head>
        <title>{getTitle(`${info.title} (@${user.username})`)}</title>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
      </Head>
      <UserHeader columns={2}>
        <UserInfo width={1}>
          <Link route={`/@${user.username}`}>
            <UserLink href={`/@${user.username}`}>
              <Avatar style={{ marginRight: '15px' }} src={user.avatar}/>
              <UserName>{user.name}</UserName>
            </UserLink>
          </Link>
        </UserInfo>
        <UserHeaderInfo width={1}>
          <BaseInfoItem style={{ marginRight: '14px' }}>
            <Eye size={20} />
            <p>{info.views}</p>
          </BaseInfoItem>
          <BaseInfoItem>
            <Heart size={20} />
            <p>{info.likes}</p>
          </BaseInfoItem>
        </UserHeaderInfo>
      </UserHeader>
      <PictureBox>
        <PictureImage size="full" detail={info} lazyload={false} />
      </PictureBox>
      <Content>
        <Title>{info.title}</Title>
        <PictureInfo
          info={info}
          onLike={like}
        />
        {
          tags.length > 0 &&
          <TagBox>
            {
              tags.map(tag => (
                <Link route={`/tag/${tag.name}`} key={tag.id}>
                  <a style={{ textDecoration: 'none' }} href={`/tag/${tag.name}`}>
                    <Tag>
                      {tag.name}
                    </Tag>
                  </a>
                </Link>
              ))
            }
          </TagBox>
        }
        {
          info.bio && (
            <Bio>
              {info.bio}
            </Bio>
          )
        }
        {
          isLocation && (
            <GpsCotent>
              <GpsImage gps={info!.exif!.location!} />
            </GpsCotent>
          )
        }
      </Content>
      <Comment onConfirm={onConfirm} comment={comment} />
    </Wrapper>
  );
};

/// TODO: mobx-react@6 @inject 不执行 getInitialProps 的暂时解决方案
Picture.getInitialProps = async ({ mobxStore, route, req }: CustomNextContext) => {
  const { params } = route;
  return mobxStore.screen.pictureStore.getPictureInfo(
    params.id!,
    req ? req.headers : undefined,
  );
};

export default withError<IProps>(
  connect((stores: IMyMobxStore) => ({
    pictureStore: stores.screen.pictureStore,
    accountStore: stores.accountStore,
    themeStore: stores.themeStore,
  }))(Picture),
);
