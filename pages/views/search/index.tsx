import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { theme } from '@lib/common/utils/themes';
import { Search } from '@lib/icon';
import { IconButton } from '@lib/components/Button';

const Wrapper = styled.div``;

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
  right: ${rem(23)};
  top: 50%;
  margin-top: -${rem(12)};
  & svg {
    width: ${rem(24)};
    height: ${rem(24)};
    stroke-width: 2.5px;
    stroke: ${theme('colors.secondary')};
  }
`;

const SearchScreen = () => (
  <Wrapper>
    <SearchHeader>
      <SearchBar>
        <InputBox>
          <Input placeholder="搜索" />
          <SearchBtn>
            <Search />
          </SearchBtn>
        </InputBox>
      </SearchBar>
    </SearchHeader>
  </Wrapper>
);

export default pageWithTranslation(I18nNamespace.Common)(SearchScreen);
