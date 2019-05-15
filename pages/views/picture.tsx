import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { PictureImage } from '@pages/containers/Picture/Item';
import { AccountStore } from '@pages/stores/AccountStore';

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
    return (
      <div>
        <PictureImage detail={this.props.screenData} />
      </div>
    );
  }
}
/// TODO: mobx-react@6 @inject 不执行 getInitialProps 的暂时解决方案
Picture.getInitialProps = async (ctx: CustomNextContext) => {
  const { params } = ctx.route;
  const { data } = await request.get<PictureEntity>(`/api/picture/${params.id}`);
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
