import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { PictureList } from '@pages/containers/Picture/List';
import { IMyMobxStore } from '@pages/stores/init';
import { HomeScreenStore } from '@pages/stores/screen/Home';

interface IProps {
  homeStore: HomeScreenStore;
}

@inject((stores: IMyMobxStore) => ({
  homeStore: stores.screen.homeStore,
}))
@observer
class Index extends React.Component<IProps> {
  public static getInitialProps: (_: CustomNextContext) => any;
  public render() {
    const { list, like, updateKey } = this.props.homeStore;
    return (
      <div>
        <Head>
          <title>肥皂</title>
        </Head>
        <PictureList updateKey={updateKey} like={like} data={list} />
      </div>
    );
  }
}

Index.getInitialProps = async (_: CustomNextContext) => {
  if (
    _.mobxStore.appStore.location &&
    _.mobxStore.appStore.location.action === 'POP' &&
    _.mobxStore.screen.homeStore.init
  ) {
    return {};
  }
  await _.mobxStore.screen.homeStore.getList(undefined, _.req ? _.req.headers : undefined);
  return {};
};

export default Index;
