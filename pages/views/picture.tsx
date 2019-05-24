import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { Avatar } from '@pages/components';
import { PictureImage } from '@pages/containers/Picture/Image';
import { Link } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

const Wrapper = styled.div`
  max-width: 1040px;
  width: 100%;
  margin: 0 auto;
  margin-top: 40px;
  padding: 0 20px;
`;

const UserHeader = styled(Grid)`
  margin-bottom: 20px;
`;

const UserLink = styled.a`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: ${_ => _.theme.colors.text};
`;

const UserName = styled.h3`
  font-size: 14px;
`;

const UserInfo = styled(Cell)`
  display: flex;
  align-items: center;
`;

const PictureBox = styled.div`
  border-radius: 3px;
  overflow: hidden;
  box-shadow: ${_ => _.theme.colors.shadowColor} 0px 6px 20px;
`;

interface InitialProps extends NextContext {
  screenData: PictureEntity;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
}

@inject('accountStore')
@observer
class Picture extends React.Component<IProps> {
  public static getInitialProps: (ctx: CustomNextContext) => any;
  public render() {
    const picture = this.props.screenData;
    const { user } = picture;
    return (
      <Wrapper>
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
