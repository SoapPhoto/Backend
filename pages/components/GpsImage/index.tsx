import React from 'react';

const getUrl = (gps: number[]) => `https://restapi.amap.com/v3/staticmap?location=${
      gps[0]
    },${gps[1]}&zoom=15&size=750*300&scale=1&markers=mid,,A:${
      gps[0]
    },${gps[1]}&key=e55a0b1eb15adb1ff24cec5a7aacd637`;

interface IProps {
  gps: number[];
}

export const GpsImage: React.FC<IProps> = ({
  gps,
}) => (
  <div>
    <img src={getUrl(gps)} />
  </div>
);
