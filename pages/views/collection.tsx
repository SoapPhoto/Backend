import React from 'react';
import { withError } from '@lib/components/withError';
import Head from 'next/head';
import { getTitle } from '@lib/common/utils';
import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { CollectionScreenStore } from '@lib/stores/screen/Collection';
import { connect } from '@lib/common/utils/store';
import { IMyMobxStore } from '@lib/stores/init';

interface IProps extends IBaseScreenProps {
  collectionStore: CollectionScreenStore;
}

const Collection: ICustomNextPage<IProps, {}> = ({
  collectionStore,
}) => {
  const { info } = collectionStore!;
  const { name, user } = info!;
  return (
    <div>
      <Head>
        <title>{getTitle(`# ${name} (@${user.username})`)}</title>
      </Head>
      <h2>{name}</h2>
    </div>
  );
};

Collection.getInitialProps = async (ctx) => {
  const { route } = ctx;
  const { id } = route.params;
  await ctx.mobxStore.screen.collectionStore.getInfo(id!, ctx.req ? ctx.req.headers : undefined);
  return {};
};

export default withError(
  connect((stores: IMyMobxStore) => ({
    collectionStore: stores.screen.collectionStore,
  }))(Collection),
);
