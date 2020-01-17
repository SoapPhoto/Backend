/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.base.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.control.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.core.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.maptype.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.overlay.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.panorama.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.rightmenu.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.service.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.tools.d.ts" />

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { rem } from 'polished';
import { useLazyQuery } from 'react-apollo';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import {
  transform, BD09, WGS84,
} from 'gcoord';

import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { SearchPlace } from '@lib/schemas/query';
import { debounce } from 'lodash';
import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';
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
  const map = useRef<mapboxgl.Map>();
  const marker = useRef<mapboxgl.Marker>();
  const container = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [searchPlace, { loading, data }] = useLazyQuery<{searchPlace: any[]}>(SearchPlace);
  const setPlace = (myValue: string) => {
    const myGeo = new BMap.Geocoder();
    myGeo.getPoint(myValue, (point) => {
      // 转换坐标
      const p = transform([point.lng, point.lat], BD09, WGS84) as [number, number];
      // eslint-disable-next-line no-unused-expressions
      map.current?.setCenter({
        lng: p[0],
        lat: p[1],
      });
      // eslint-disable-next-line no-unused-expressions
      marker.current?.setLngLat(p).addTo(map.current!);
      // eslint-disable-next-line no-unused-expressions
      map.current?.setZoom(14);
      getLocationInfo(p);
    }, '全国');
  };
  const getLocationInfo = useCallback((point: [number, number]) => {
    const myGeo = new BMap.Geocoder();
    myGeo.getLocation(new BMap.Point(
      ...transform(point, WGS84, BD09) as [number, number],
    ), (result) => {
      if (result) {
        console.log(result);
      }
    }, {
      poiRadius: 200,
      numPois: 20,
    });
  }, []);
  const handleConform = (e: { type: string; target: any; item: any }) => {
    const _value = e.item.value;
    const myValue = _value.province
      + _value.city
      + _value.district
      + _value.street
      + _value.business;
    setPlace(myValue);
  };
  useEnhancedEffect(() => {
    if (visible) {
      mapboxgl.accessToken = 'pk.eyJ1IjoieWlpdSIsImEiOiJjazJvMmJ3M2QwejYzM21tdWdiZzR6cmUwIn0.XolZlohi-gYoIdMoen7Gyg';
      map.current = new mapboxgl.Map({
        container: container.current!,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [111.94, 35.57],
        zoom: 3,
        // 禁止旋转
        pitchWithRotate: false,
        attributionControl: false,
        antialias: true,
      });
      const nav = new mapboxgl.NavigationControl({
        showCompass: false,
      });
      marker.current = new mapboxgl.Marker({
        draggable: true,
      });
      map.current.addControl(nav, 'top-right');
      const language = new MapboxLanguage();
      map.current.addControl(language);
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }));
      // eslint-disable-next-line no-unused-expressions
      marker.current.on('dragend', () => {
        const lngLat = marker.current!.getLngLat();
        getLocationInfo([lngLat.lng, lngLat.lat]);
      });
      const ac = new BMap.Autocomplete({ input: 'suggestId', location: '全国' }); // 建立一个自动完成的对象
      // 选中的时候，操作地图，增加标签
      ac.onconfirm = handleConform;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            id="suggestId"
            placeholder="查找地址..."
            // value={value}
            // onChange={e => setValue(e.target.value)}
            // onPressEnter={query}
          />
        </Search>
        <div ref={container} style={{ width: '100%', height: '60%' }} />
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
