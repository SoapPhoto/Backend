import React from 'react';
import styled from 'styled-components';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { connect } from '@pages/common/utils/store';
import { PictureList } from '@pages/containers/Picture/List';
import { IMyMobxStore } from '@pages/stores/init';
import { TagScreenStore } from '@pages/stores/screen/Tag';
import Head from 'next/Head';
import { rem } from 'polished';

interface IProps {
  tagStore: TagScreenStore;
}

const Wrapper = styled.div``;

const Title = styled.h2`
  width: 100%;
  max-width: ${rem('1300px')};
  margin: ${rem('46px')} auto;
  padding: 0 ${rem('24px')};
  font-size: ${_ => rem(_.theme.fontSizes[5])};
`;

const TagDetail: React.FC<IProps> = ({
  tagStore,
}) => {
  const { info } = tagStore;
  return (
    <Wrapper>
      <Head>
        <title>#{info.name} - 肥皂</title>
      </Head>
      <Title>#{info.name}</Title>
      <PictureList
        noMore={tagStore.isNoMore}
        onPage={tagStore.getPageList}
        like={tagStore.like}
        data={tagStore.list}
      />
    </Wrapper>
  );
};

(TagDetail as any).getInitialProps = async (ctx: CustomNextContext) => {
  const { params } = ctx.route;
  if (
    ctx.mobxStore.appStore.location &&
    ctx.mobxStore.appStore.location.action === 'POP' &&
    ctx.mobxStore.screen.tagStore.init &&
    ctx.mobxStore.screen.tagStore.name === params.name!
  ) {
    return {};
  }
  await ctx.mobxStore.screen.tagStore.getInit(params.name!, ctx.req ? ctx.req.headers : undefined);
  return {};
};

export default connect((stores: IMyMobxStore) => ({
  tagStore: stores.screen.tagStore,
}))(TagDetail);
