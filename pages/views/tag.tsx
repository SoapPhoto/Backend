import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { NextSeo } from 'next-seo';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle, server } from '@lib/common/utils';
import { PictureList } from '@lib/containers/Picture/List';
import { Package } from '@lib/icon';
import { withError } from '@lib/components/withError';
import { useScreenStores } from '@lib/stores/hooks';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { observer } from 'mobx-react';

const Wrapper = styled.div``;

const Header = styled.div`
  ${WrapperBox()}
  margin: ${rem('46px')} auto;
`;

const Title = styled.h2`
  width: 100%;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  text-align: center;
  font-size: ${rem(50)};
  margin-top: ${rem(5)};
  margin-bottom: ${rem(25)};
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

const TagDetail: ICustomNextPage<IBaseScreenProps, {}> = observer(() => {
  const { tagStore, tagPictureList } = useScreenStores();
  const { t } = useTranslation();
  const { info } = tagStore;
  const {
    list, isNoMore, like, getPageList,
  } = tagPictureList;
  const title = getTitle(`# ${info.name}`, t);
  return (
    <Wrapper>
      <NextSeo
        title={title}
        description={`${info.name}的Soap照片专题页。`}
      />
      <Header>
        <Title>
          {info.name}
        </Title>
        <PictureNumber>
          <Package />
          <span>
            {t('img_count', info.pictureCount.toString())}
          </span>
        </PictureNumber>
      </Header>
      <PictureList
        noMore={isNoMore}
        onPage={getPageList}
        like={like}
        data={list}
      />
    </Wrapper>
  );
});

TagDetail.getInitialProps = async (ctx: ICustomNextContext) => {
  const { params } = ctx.route;
  const { appStore, screen } = ctx.mobxStore;
  const { tagStore, tagPictureList } = screen;
  const { location } = appStore;
  const isPop = location && location.action === 'POP' && !server;
  if (isPop) {
    await tagStore.getCache(params.name!);
    await tagPictureList.getCache(params.name!);
  } else {
    await tagStore.getInfo(params.name!);
    await tagPictureList.getList(params.name!);
  }

  return {};
};

export default withError(pageWithTranslation()(TagDetail));
