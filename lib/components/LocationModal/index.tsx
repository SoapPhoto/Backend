import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { rem } from 'polished';
import { useLazyQuery } from 'react-apollo';

import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { SearchPlace } from '@lib/schemas/query';
import { debounce } from 'lodash';
import { Modal, Header, Title } from '../Modal';
import { Input } from '../Input';
import { Loading } from '../Loading';

interface IProps {
  visible: boolean;
  onClose: () => void;
}


const ModalContent = styled(Modal)`
  padding: 0 !important;
  max-width: ${rem(800)} !important;
  height: 80vh;
  margin: ${rem(24)} auto !important;
  ${customMedia.lessThan('mobile')`
    height: 80vh !important;
    margin-top: 20vh !important;
    margin-bottom: 0 !important;
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  `}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled(OverlayScrollbarsComponent)`
  flex: 1;
  background-color: ${theme('colors.background')};
  /* max-height: 100%; */
`;

const Search = styled.div`
  padding: ${rem(8)} ${rem(12)};
`;

const LoadingBox = styled.div`
  height: 100%;
  display: flex;
`;

export const LocationModal: React.FC<IProps> = ({
  visible,
  onClose,
}) => {
  const [value, setValue] = useState('');
  const [searchPlace, { loading, data }] = useLazyQuery<{searchPlace: any[]}>(SearchPlace);
  useEffect(() => {
    if (visible) {
      const map = new (window as any).BMap.Map('map');
      const point = new (window as any).BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 11);
      map.enableScrollWheelZoom(false);
      map.addControl(new (window as any).BMap.ScaleControl({ anchor: (window as any).BMAP_ANCHOR_TOP_LEFT }));
      map.setMapStyleV2({
        styleId: 'd5e72abd077744f09ef5d082c769d637',
      });
      const gc = new (window as any).BMap.Geocoder();
      gc.getLocation(point, (rs: any) => {
        console.log(rs);
      });
    }
  }, [visible]);
  const query = useCallback(debounce(() => {
    searchPlace({
      variables: {
        value,
      },
    });
  }, 300), [value]);
  return (
    <ModalContent
      visible={visible}
      onClose={onClose}
    >
      <Wrapper>
        <Header>
          <Title>图片位置</Title>
        </Header>
        <Search>
          <Input
            placeholder="查找地址..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onPressEnter={query}
          />
        </Search>
        <div id="map" style={{ width: '100%', height: '60%' }} />
        <Content
          options={{ scrollbars: { autoHide: 'move' }, sizeAutoCapable: false }}
        >
          {
            loading ? (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            ) : data ? (
              <div>
                {
                  data.searchPlace.map((place: any, index) => (
                    <div key={index}>
                      <div>{place.name}</div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div />
            )
          }
        </Content>
      </Wrapper>
    </ModalContent>
  );
};
