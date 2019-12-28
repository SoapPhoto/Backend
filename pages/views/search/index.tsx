import React, { useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { theme } from '@lib/common/utils/themes';
import { Search } from '@lib/icon';
import { IconButton } from '@lib/components/Button';
import { observer } from 'mobx-react';
import { ICustomNextPage, ICustomNextContext } from '@lib/common/interfaces/global';
import { useRouter } from '@lib/router';
import { useStores } from '@lib/stores/hooks';
import { server, getTitle } from '@lib/common/utils';
import { PictureList } from '@lib/containers/Picture/List';
import { Loading } from '@lib/components/Loading';
import { SEO } from '@lib/components';
import { useTranslation } from '@lib/i18n/useTranslation';
import { withError } from '@lib/components/withError';

interface IProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
`;

const SearchHeader = styled.div`
  padding: ${rem(48)} ${rem(16)};
  /* background: #fff; */
`;

const SearchBar = styled.div`
`;

const InputBox = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: ${rem(600)};
`;

const Input = styled.input`
  border: 1.5px solid ${theme('colors.gray')};
  line-height: ${rem(46)};
  background-color: ${theme('colors.pure')};
  width: 100%;
  padding: 0 ${rem(24)};
  border-radius: ${rem(23)};
  outline: none;
  color: ${theme('colors.text')};
`;

const SearchBtn = styled(IconButton)`
  position: absolute;
  right: ${rem(17)};
  top: 50%;
  margin-top: -${rem(15)};
  padding: ${rem(6)};
  & svg {
    width: ${rem(18)};
    height: ${rem(18)};
    stroke-width: 2.5px;
    stroke: ${theme('colors.secondary')};
  }
`;

const LoadingBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${rem(16)};
`;

const Message = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${rem(16)};
  font-size: ${_ => rem(theme('fontSizes[5]')(_))};
  font-weight: 600;
`;

const SearchScreen = observer<ICustomNextPage<IProps, {}>>(() => {
  const { screen } = useStores();
  const { t } = useTranslation();
  const { query, pushRoute, pathname } = useRouter();
  const { searchPictures } = screen;
  const {
    loading, list, isNoMore, like, getPageList, restQuery, setWords,
  } = searchPictures;
  const searchChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWords(e.target.value);
  }, [setWords]);
  const onSearch = useCallback(() => {
    if (!restQuery.words) return;
    pushRoute(`${pathname}?q=${restQuery.words}`, {}, {
      shallow: true,
    });
    searchPictures.search(restQuery.words);
  }, [pathname, pushRoute, restQuery.words, searchPictures]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }, [onSearch]);
  return (
    <Wrapper>
      <SEO
        title={getTitle('title.search', t)}
        description={`${restQuery.words ? `${restQuery.words}的Soap照片。` : '有趣的方式来和小伙伴分享你生活的照片。'}`}
      />
      <SearchHeader>
        <SearchBar>
          <InputBox>
            <Input
              value={restQuery.words}
              onChange={searchChanged}
              onKeyDown={handleKeyDown}
              placeholder={t('search.label.search')}
            />
            <SearchBtn disabled={loading} onClick={onSearch}>
              <Search />
            </SearchBtn>
          </InputBox>
        </SearchBar>
      </SearchHeader>
      {
        loading ? (
          <LoadingBox>
            <Loading size={10} />
          </LoadingBox>
        ) : (
          query.q ? (
            <PictureList
              noMore={isNoMore}
              onPage={getPageList}
              like={like}
              data={list}
            />
          ) : (
            <Message><span>{t('search.message.try')}</span></Message>
          )
        )
      }
    </Wrapper>
  );
});

SearchScreen.getInitialProps = async ({
  mobxStore, route,
}: ICustomNextContext) => {
  const { query } = route;
  const { appStore, screen } = mobxStore;
  const { location } = appStore;
  const { searchPictures } = screen;
  const isPop = location && location.action === 'POP' && !server;
  searchPictures.setWords(query.q || '');
  if (isPop && query.q) {
    await searchPictures.getListCache();
  }
  if (server) {
    await searchPictures.search(query.q || '');
  }
  return {};
};

export default pageWithTranslation(I18nNamespace.Search)(withError(SearchScreen));
