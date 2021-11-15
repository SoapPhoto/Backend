import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MapboxService } from '@server/shared/mapbox/mapbox.service';
import { BaiduService } from '@server/shared/baidu/baidu.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @Inject(forwardRef(() => MapboxService))
    private readonly mapboxService: MapboxService,
    @Inject(forwardRef(() => BaiduService))
    private readonly baiduService: BaiduService,
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  public async search(value: string, region?: string) {
    const placeList = await this.baiduService.chinaPlaceSearch(value, region);
    return placeList;
  }

  public async placeSuggestion(value: string, region: string) {
    const placeList = await this.baiduService.placeSuggestion(value, region);
    return placeList;
  }

  public async placeDetail(uid: string) {
    const placeDetail = await this.baiduService.placeDetail(uid);
    return placeDetail;
  }

  public async reverseGeocoding(location: string) {
    const data = await this.baiduService.reverseGeocoding(location);
    return data;
  }

  public async getOneOrCreate(uid: string) {
    const data = await this.locationRepository.findOne({ uid });
    if (!data) {
      const poi = await this.placeDetail(uid);
      if (poi) {
        await this.locationRepository.save(poi);
      }
    }
    return this.locationRepository.findOne({ uid });
  }
}
