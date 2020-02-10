import { request } from '@lib/common/utils/request';
import { IMapboxGeocodeFeature } from '@lib/common/interfaces/location';
import { LocationClientType } from '@common/enum/location';

export const searchGeocode = async (value: string) => (
  request.get<IMapboxGeocodeFeature[]>(`/api/location/search/${value}`, {
    params: {
      clientType: LocationClientType.MAPBOX,
    },
  })
);
