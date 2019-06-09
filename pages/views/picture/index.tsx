import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { NextPageContext } from 'next';
import Head from 'next/Head';
import React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { Avatar, GpsImage } from '@pages/components';
import { EXIFModal } from '@pages/components/EXIFModal';
import { LikeButton } from '@pages/components/LikeButton';
import { Popover } from '@pages/components/Popover';
import { PictureImage } from '@pages/containers/Picture/Image';
import { Calendar } from '@pages/icon';
import { Link } from '@pages/routes';
import { likePicture } from '@pages/services/picture';
import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { action, computed, observable, set } from 'mobx';
import { Cell } from 'styled-css-grid';
import {
  BaseInfoHandleBox,
  BaseInfoItem,
  Bio,
  Content,
  GpsCotent,
  InfoButton,
  PictureBaseInfo,
  PictureBox,
  Title,
  UserHeader,
  UserInfo,
  UserLink,
  UserName,
  Wrapper,
} from './styles';

interface InitialProps extends NextPageContext {
  screenData: PictureEntity;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
  themeStore: ThemeStore;
}

@inject('accountStore', 'themeStore')
@observer
class Picture extends React.Component<IProps> {
  public static getInitialProps: (ctx: CustomNextContext) => any;
  @observable public picture = this.props.screenData;
  @observable public EXIFVisible = false;

  @computed get isLocation() {
    return this.picture.exif && this.picture.exif.location && this.picture.exif.location.length > 0;
  }
  @action public like = async () => {
    set(this.picture, 'isLike', !this.picture.isLike);
    await likePicture(this.picture.id);
  }
  public openPicture = () => {
    this.EXIFVisible = true;
  }
  public render() {
    const { isLogin } = this.props.accountStore;
    const { themeData } = this.props.themeStore;
    // tslint:disable-next-line: no-this-assignment
    const { picture } = this;
    const { user } = picture;
    return (
      <Wrapper>
        <Head>
          <title>{picture.title} (@{user.username}) - 肥皂</title>
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
          <Cell width={1}/>
        </UserHeader>
        <PictureBox>
          <PictureImage size="full" detail={picture} lazyload={false} />
        </PictureBox>
        <Content>
          <Title>{picture.title}</Title>
          <PictureBaseInfo>
            <div>
              <Popover
                openDelay={100}
                trigger="hover"
                placement="top"
                theme="dark"
                content={<span>{moment(picture.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
              >
                <BaseInfoItem>
                  <Calendar size={20} />
                  <p>{moment(picture.createTime).from()}</p>
                </BaseInfoItem>
              </Popover>
            </div>
            <BaseInfoHandleBox>
              <Popover
                trigger="hover"
                placement="top"
                theme="dark"
                openDelay={100}
                content={<span>图片信息</span>}
              >
                <InfoButton style={{ cursor: 'pointer' }} onClick={this.openPicture}/>
              </Popover>
              {
                isLogin &&
                <LikeButton
                  color={themeData.colors.secondary}
                  isLike={picture.isLike}
                  size={22}
                  onLike={this.like}
                />
              }
            </BaseInfoHandleBox>
          </PictureBaseInfo>
          {
            picture.bio && (
              <Bio>
                {picture.bio}
              </Bio>
            )
          }
          {
            this.isLocation && (
              <GpsCotent>
                <GpsImage gps={picture!.exif!.location!} />
              </GpsCotent>
            )
          }
        </Content>
        <EXIFModal
          visible={this.EXIFVisible}
          onClose={() => this.EXIFVisible = false}
          picture={this.picture}
        />
      </Wrapper>
    );
  }
}
/// TODO: mobx-react@6 @inject 不执行 getInitialProps 的暂时解决方案
Picture.getInitialProps = async (ctx: CustomNextContext) => {
  const { params } = ctx.route;
  const { data } = await request.get<PictureEntity>(`/api/picture/${params.id}`, {
    headers: ctx.req ? ctx.req.headers : {},
  });
  if (!data) {
    return {
      error: {
        status: 404,
      },
    };
  }
  return {
    screenData: data,
  };
};

export default Picture;
