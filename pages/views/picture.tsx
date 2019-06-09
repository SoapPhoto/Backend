import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { NextPageContext } from 'next';
import Head from 'next/Head';
import { rem } from 'polished';
import React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { Avatar, GpsImage } from '@pages/components';
import { EXIFModal } from '@pages/components/EXIFModal';
import { LikeButton } from '@pages/components/LikeButton';
import { Popover } from '@pages/components/Popover';
import { NoSSR } from '@pages/components/SSR';
import { PictureImage } from '@pages/containers/Picture/Image';
import { Calendar, Info } from '@pages/icon';
import { Link } from '@pages/routes';
import { likePicture } from '@pages/services/picture';
import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { action, computed, observable, set } from 'mobx';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

const Wrapper = styled.div`
  max-width: ${rem('1040px')};
  width: 100%;
  margin: 0 auto;
  margin-top: ${rem('40px')};
  padding: 0 ${rem('20px')};
`;

const UserHeader = styled(Grid)`
  margin: 0 auto;
  margin-bottom: ${rem('20px')};
  max-width: ${rem('780px')};
`;

const UserLink = styled.a`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: ${_ => _.theme.colors.text};
`;

const UserName = styled.h3`
  font-size: ${_ => rem(_.theme.fontSizes[2])};
`;

const UserInfo = styled(Cell)`
  display: flex;
  align-items: center;
`;

const PictureBox = styled.div`
  border-radius: ${rem('3px')};
  overflow: hidden;
  box-shadow: ${_ => _.theme.colors.shadowColor} ${rem('0px')} ${rem('6px')} ${rem('20px')};
`;

const Content = styled.div`
  max-width: ${rem('780px')};
  margin: ${rem('48px')} auto;
`;

const Title = styled.h2`
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-bottom: ${rem('18px')};
`;

const GpsCotent = styled.div`
  margin: ${rem('24px')} 0;
`;

const PictureBaseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${_ => _.theme.colors.secondary};
`;

const BaseInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  & svg {
    margin-right: ${rem('6px')};
    margin-top: -${rem('4px')};
  }
`;

const BaseInfoHandleBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: ${rem('6px')};
`;

const Bio = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[2])};
  margin-top: ${rem('18px')};
`;

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
              <Info onClick={this.openPicture}/>
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
        <NoSSR>
          {
            this.EXIFVisible &&
            <EXIFModal onClose={() => this.EXIFVisible = false} picture={this.picture} />
          }
        </NoSSR>
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
