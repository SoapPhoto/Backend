import React, { useMemo } from 'react';
import styled from 'styled-components';

import { transform, WGS84, GCJ02 } from 'gcoord';
import { useTheme } from '@lib/common/utils/themes/useTheme';

// const getUrl = (gps: number[]) => `https://restapi.amap.com/v3/staticmap?location=${
//   gps[1]
// },${gps[0]}&zoom=15&size=600*300&scale=2&markers=mid,,A:${
//   gps[1]
// },${gps[0]}&key=e55a0b1eb15adb1ff24cec5a7aacd637`;

interface IProps {
  gps: number[];
  alt?: string;
}

const Wrapper = styled.div`
  width: 100%;
  border-radius: 3px;
  overflow: hidden;
  &>img {
    display: block;
    width: 100%;
  }
`;

export const GpsImage: React.FC<IProps> = ({
  gps,
  alt = '',
}) => {
  const { mapbox } = useTheme();
  const gpsString = useMemo(() => transform([gps[1], gps[0]], GCJ02, WGS84), [gps]).toString();
  const src = useMemo(() => `//api.mapbox.com/styles/v1/${mapbox.style}/static/pin-s-attraction+285A98(${gpsString},14)/${gpsString},14,0,0/600x300@2x?access_token=${process.env.MAPBOX_AK}&attribution=false&logo=false`, [gpsString, mapbox.style]);
  return (
    <Wrapper>
      <img src={src} alt={alt} />
    </Wrapper>
  );
};
