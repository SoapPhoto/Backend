import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle, server } from '@lib/common/utils';
import { PictureList } from '@lib/containers/Picture/List';
import { Package, Hash, StrutAlign } from '@lib/icon';
import { withError } from '@lib/components/withError';
import { useScreenStores } from '@lib/stores/hooks';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { observer } from 'mobx-react';
import { SEO } from '@lib/components';
import { theme } from '@lib/common/utils/themes';

const Wrapper = styled.div`
`;

const Header = styled.div`
  ${WrapperBox()}
  max-width: ${_ => rem(theme('width.header')(_))};
  margin: 0 auto;
  margin: ${rem('46px')} auto;
`;

const Title = styled.h2`
  width: 100%;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  font-size: ${rem(50)};
  margin-bottom: ${rem(4)};
`;

const PictureNumber = styled.p`
  display: flex;
`;

const HashIcon = styled(Hash)`
  color: ${theme('colors.secondary')};
  stroke-width: 3px;
  margin-right: ${rem(6)};
`;

const PictureNumberCount = styled.span`
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
      <SEO
        title={title}
        description={`${info.name}的Soap照片专题页。`}
      />
      <Header>
        <Title>
          <StrutAlign>
            <HashIcon />
          </StrutAlign>
          {info.name}
        </Title>
        <PictureNumber>
          <PictureNumberCount>
            {/* {t('img_count', info.pictureCount.toString())} */}
          </PictureNumberCount>
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
  tagPictureList.setName(params.name!);
  if (isPop) {
    await Promise.all([
      tagStore.getCache(params.name!),
      tagPictureList.getListCache(),
    ]);
  } else {
    await Promise.all([
      tagStore.getInfo(params.name!),
      tagPictureList.getList(false),
    ]);
  }

  return {};
};

export default withError(pageWithTranslation()(TagDetail));
