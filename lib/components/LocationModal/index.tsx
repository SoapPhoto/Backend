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
  useCallback, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import {
  transform, BD09, WGS84,
} from 'gcoord';
import { useLazyQuery } from 'react-apollo';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';
import { PictureLocation } from '@lib/common/interfaces/picture';
import { X } from '@lib/icon';
import { SearchPlace } from '@lib/schemas/query';
import { formatLocationTitle, formatLocationData } from '@lib/common/utils/image';
import { debounce } from 'lodash';
import { Modal, Header, Title } from '../Modal';
import { Input } from '../Input';
import { IconButton, Button } from '../Button';
import { Popover } from '../Popover';
import { Loading } from '../Loading';

interface IProps {
  visible: boolean;
  current?: PictureLocation;
  onClose: () => void;
  onConfirm: (data: PictureLocation) => void;
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

const Content = styled.div`
  flex: 1;
  position: relative;
`;

const Search = styled.div`
  padding: ${rem(8)} ${rem(12)};
`;

const SearchBox = styled.div`
  width: 100%;
  position: relative;
`;

const Handle = styled.div`
  position: absolute;
  bottom: ${rem(24)};
  right: ${rem(24)};
`;

const XButton = styled(X)`
  color: ${theme('colors.text')};
`;

const SearchPopover = styled.div`
  padding: 0;
  /* display: flex; */
  /* min-height: 0px; */
`;

const SearchPopoverContent = styled(OverlayScrollbarsComponent)`
  /* flex: 1; */
  max-height: ${rem(250)};
  /* max-height: 100%; */
`;

const LoadingBox = styled.div`
  height: 100%;
  padding: ${rem(24)};
  display: flex;
`;

const SearchPopoverItem = styled.div`
  padding: ${rem(8)} ${rem(12)};
  cursor: pointer;
  :hover {
    background-color: ${theme('layout.header.menu.hover.background')};
  }
`;

const SearchPopoverItemTitle = styled.p`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
`;

const SearchPopoverItemBio = styled.p`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;

export const LocationModal: React.FC<IProps> = ({
  visible,
  onClose,
  current,
  onConfirm,
}) => {
  const searchContainer = useRef<HTMLDivElement>(null);
  const searchPopover = useRef<Popover>(null);
  const [searchPlace, { loading, data }] = useLazyQuery<{searchPlace: any[]}>(SearchPlace);
  const map = useRef<mapboxgl.Map>();
  const marker = useRef<mapboxgl.Marker>();
  const container = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [locationState, setLocationState] = useState<PictureLocation>();
  const setPlace = (myValue: string, city = '全国') => {
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
    }, city);
  };
  const getLocationInfo = useCallback((point: [number, number]) => {
    const myGeo = new BMap.Geocoder();
    setLocationState(undefined);
    myGeo.getLocation(new BMap.Point(
      ...transform(point, WGS84, BD09) as [number, number],
    ), (result) => {
      if (result) {
        setLocationState(formatLocationData(result));
      }
    }, {
      poiRadius: 200,
      numPois: 20,
    });
  }, []);
  const handleConform = ({ location }: any) => {
    // eslint-disable-next-line no-unused-expressions
    searchPopover.current?.close();
    // const point = transform([location.lng, location.lat], BD09, WGS84) as [number, number];
    const point = [location.lng, location.lat] as [number, number];
    // eslint-disable-next-line no-unused-expressions
    map.current?.setCenter(point);
    // eslint-disable-next-line no-unused-expressions
    marker.current?.setLngLat(point).addTo(map.current!);
    // eslint-disable-next-line no-unused-expressions
    map.current?.setZoom(17);
    getLocationInfo(point);
  };
  useEnhancedEffect(() => {
    if (visible) {
      let center: mapboxgl.LngLatLike = [111.94, 35.57];
      let zoom = 3;
      mapboxgl.accessToken = 'pk.eyJ1IjoieWlpdSIsImEiOiJjazJvMmJ3M2QwejYzM21tdWdiZzR6cmUwIn0.XolZlohi-gYoIdMoen7Gyg';
      if (current) {
        center = transform([current.point.lng, current.point.lat], BD09, WGS84) as mapboxgl.LngLatLike;
        zoom = 17;
      }
      map.current = new mapboxgl.Map({
        center,
        zoom,
        container: container.current!,
        style: 'mapbox://styles/mapbox/streets-v10',
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
      if (current) {
        marker.current.setLngLat(center).addTo(map.current!);
      }
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
      // const input = document.querySelector('#suggestId') as HTMLInputElement;
      // const ac = new BMap.Autocomplete({ input: 'suggestId', location: '全国' }); // 建立一个自动完成的对象
      // // 选中的时候，操作地图，增加标签
      // if (input && current) {
      //   ac.setInputValue(formatLocationTitle(current));
      // }
      // ac.onconfirm = handleConform;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const query = useCallback(debounce(() => {
    searchPopover.current?.open();
    searchPlace({
      variables: {
        value,
      },
    });
  }, 300), [value]);
  const afterClose = useCallback(() => {
    setLocationState(undefined);
    setValue('');
  }, []);
  const confirm = useCallback(() => {
    if (locationState) {
      onConfirm(locationState);
      onClose();
    }
  }, [locationState, onClose, onConfirm]);
  return (
    <ModalContent
      visible={visible}
      onClose={onClose}
      afterClose={afterClose}
    >
      <Wrapper>
        <Header>
          <Title>图片位置</Title>
          <IconButton onClick={onClose}>
            <XButton />
          </IconButton>
        </Header>
        <Search ref={searchContainer}>
          <SearchBox>
            <Popover
              wrapperStyle={{
                width: '100%',
              }}
              contentStyle={{ padding: 0 }}
              ref={searchPopover}
              placement="bottom-start"
              arrow={false}
              openDelay={100}
              place
              content={(
                <SearchPopover>
                  <SearchPopoverContent
                    options={{ scrollbars: { autoHide: 'move' }, sizeAutoCapable: true }}
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
                              <SearchPopoverItem key={index} onClick={() => handleConform(place)}>
                                <SearchPopoverItemTitle>
                                  {formatLocationTitle(place)}
                                  {place.name}
                                </SearchPopoverItemTitle>
                                <SearchPopoverItemBio>{place.address}</SearchPopoverItemBio>
                              </SearchPopoverItem>
                            ))
                          }
                        </div>
                      ) : (
                        <div />
                      )
                    }
                  </SearchPopoverContent>
                </SearchPopover>
              )}
            >
              <Input
                id="suggestId"
                placeholder="查找地址..."
                value={value}
                onChange={e => setValue(e.target.value)}
                onPressEnter={query}
              />
            </Popover>
          </SearchBox>
        </Search>
        <Content>
          <div ref={container} style={{ width: '100%', height: '100%' }} />
          <Handle>
            <Button disabled={!locationState} onClick={confirm}>
              添加位置信息
            </Button>
          </Handle>
        </Content>
      </Wrapper>
    </ModalContent>
  );
};
