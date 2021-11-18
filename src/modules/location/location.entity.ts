import { BaseEntity } from '@server/common/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface ILocation {
  lng: number
  lat: number
}

export interface ILocationDetail {
  tag: string;
  navi_location: ILocation;
  shop_hours: string;
  detail_url: string;
  type: string;
  overall_rating: string;
  image_num: string;
  comment_num: string;
  scope_type: string;
  content_tag: string;
}

@Exclude()
@Entity('location')
export class LocationEntity extends BaseEntity {
  @PrimaryColumn()
  @Expose()
  public uid!: string;

  /**
   * 来源： 百度 高德 mapbox
   *
   * @type {string}
   * @memberof LocationEntity
   */
  @Column({ default: 'BAIDU' })
  @Expose()
  public form!: string;

  @Column({ nullable: true })
  @Expose()
  public streetId!: string;

  @Column('simple-json')
  @Expose()
  public location!: ILocation;

  @Column({ nullable: true })
  @Expose()
  public name!: string;

  @Column({ nullable: true })
  @Expose()
  public address!: string;

  @Column({ nullable: true })
  @Expose()
  public province!: string;

  @Column({ nullable: true })
  @Expose()
  public city!: string;

  @Column({ nullable: true })
  @Expose()
  public area!: string;

  @Column('simple-json')
  @Expose()
  public detail!: ILocationDetail;
}
