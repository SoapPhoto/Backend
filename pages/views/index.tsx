import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';

import { IPictureListRequest } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { PictureList } from '@pages/containers/Picture/List';
import { AccountStore } from '@pages/stores/AccountStore';

interface InitialProps extends NextContext {
  screenData: IPictureListRequest;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
}

@inject('accountStore')
@observer
export default class Index extends React.Component<IProps> {
  public static async getInitialProps(_: NextContext<any>) {
    const { data } = await request.get<IPictureListRequest>('/api/picture');
    return {
      screenData: data,
    };
  }
  public render() {
    const { screenData } = this.props;
    return (
      <div>
        <PictureList data={screenData} />
      </div>
    );
  }
}
