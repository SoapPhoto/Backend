import { Exclude, Expose, Type } from 'class-transformer';

interface ILocation {
  lng: number;
  lat: number;
}

@Exclude()
export class PlaceDetail {
  @Expose()
  public tag!: string;

  @Expose()
  public type?: string;

  @Expose()
  public naviLocation?: ILocation;

  @Expose()
  public image?: string;
}

@Exclude()
export class Place {
  @Expose()
  public uid!: string;

  @Expose()
  public name!: string;

  @Expose()
  public province!: string;

  @Expose()
  public city!: string;

  @Expose()
  public district!: string;

  @Expose()
  public area!: string;

  @Expose()
  public location!: ILocation;

  @Expose()
  public address!: string;

  @Expose()
  @Type(() => PlaceDetail)
  public detail!: PlaceDetail;
}
