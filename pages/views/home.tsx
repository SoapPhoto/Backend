import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { IPictureListRequest } from '@pages/common/interfaces/picture';
import { PictureList } from '@pages/containers/Picture/List';
import { AccountStore } from '@pages/stores/AccountStore';
import { IMyMobxStore } from '@pages/stores/init';

interface InitialProps extends NextContext {
  screenData: IPictureListRequest;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
  initialStore: IMyMobxStore;
}

export default class Index extends React.Component<IProps> {
  public static async getInitialProps(_: CustomNextContext) {
    if (
      _.mobxStore.appStore.location &&
      _.mobxStore.appStore.location.action === 'POP' &&
      _.mobxStore.homeStore.init
    ) {
      return {};
    }
    await _.mobxStore.homeStore.getList();
    return {};
  }
  public render() {
    const { list } = this.props.initialStore.homeStore;
    return (
      <div>
        <PictureList data={list} />
      </div>
    );
  }
}
