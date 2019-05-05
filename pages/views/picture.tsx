import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { parsePath } from '@pages/common/utils';
import { request } from '@pages/common/utils/request';
import { AccountStore } from '@pages/stores/AccountStore';
import { Request } from 'express';

interface InitialProps extends NextContext {
  screenData: PictureEntity;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
}
@inject('accountStore')
@observer
export default class Picture extends React.Component<IProps> {
  public static async getInitialProps(_: NextContext<any, Request>) {
    const { params } = parsePath(_.asPath, '/picture/:id([0-9]+)');
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
  }
  public render() {
    console.log(this.props);
    return (
      <div>41242</div>
    );
  }
}
