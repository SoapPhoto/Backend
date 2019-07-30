import React from 'react';
import styled from 'styled-components';

const getUrl = (gps: number[]) => `https://restapi.amap.com/v3/staticmap?location=${
  gps[1]
},${gps[0]}&zoom=15&size=600*300&scale=2&markers=mid,,A:${
  gps[1]
},${gps[0]}&key=e55a0b1eb15adb1ff24cec5a7aacd637`;

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
}) => (
  <Wrapper>
    <img src={getUrl(gps)} alt={alt} />
  </Wrapper>
);
