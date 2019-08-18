import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { rem } from 'polished';

import { ICustomNextContext, ICustomNextPage } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { PictureList } from '@lib/containers/Picture/List';
import { IMyMobxStore } from '@lib/stores/init';
import { TagScreenStore } from '@lib/stores/screen/Tag';
import { Package } from '@lib/icon';

interface IProps {
  tagStore: TagScreenStore;
}

const Wrapper = styled.div``;

const Header = styled.div`
  padding: 0 ${rem('24px')};
  margin: ${rem('46px')} auto;
`;

const Title = styled.h2`
  width: 100%;
  max-width: ${rem('1300px')};
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  text-align: center;
  font-size: ${rem('50px')};
  margin: ${rem(5)} 0 ${rem(25)};
`;

const PictureNumber = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: ${rem('6px')};
    margin-top: -${rem('2px')};
  }
`;

const TagDetail: ICustomNextPage<IProps, {}> = ({
  tagStore,
}) => {
  const { info } = tagStore;
  return (
    <Wrapper>
      <Head>
        <title>{getTitle(`# ${info.name}`)}</title>
      </Head>
      <Header>
        <Title>
          {info.name}
        </Title>
        <PictureNumber>
          <Package />
          <span>
            {info.pictureCount}
            {' '}
            个照片
          </span>
        </PictureNumber>
      </Header>
      <PictureList
        noMore={tagStore.isNoMore}
        onPage={tagStore.getPageList}
        like={tagStore.like}
        data={tagStore.list}
      />
    </Wrapper>
  );
};

TagDetail.getInitialProps = async (ctx: ICustomNextContext) => {
  const { params } = ctx.route;
  if (
    ctx.mobxStore.appStore.location
    && ctx.mobxStore.appStore.location.action === 'POP'
    && ctx.mobxStore.screen.tagStore.init
    && ctx.mobxStore.screen.tagStore.name === params.name!
  ) {
    return {};
  }
  await ctx.mobxStore.screen.tagStore.getInit(params.name!, ctx.req ? ctx.req.headers : undefined);
  return {};
};

export default connect((stores: IMyMobxStore) => ({
  tagStore: stores.screen.tagStore,
}))(TagDetail);
