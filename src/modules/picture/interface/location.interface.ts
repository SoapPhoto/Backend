import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class Poi {
  /**
   * 地址
   *
   * @type {string}
   * @memberof Poi
   */
  @Expose()
  public addr?: string;

  /**
   * 名称
   *
   * @type {string}
   * @memberof Poi
   */
  @Expose()
  public name?: string;

  /**
   * 类型
   *
   * @type {string}
   * @memberof Poi
   */
  @Expose()
  public poiType?: string;

  /**
   * point
   *
   * @type {any}
   * @memberof Poi
   */
  @Expose()
  public point?: any;

  /**
   * tag
   *
   * @type {string}
   * @memberof Poi
   */
  @Expose()
  public tag?: string;
}

@Exclude()
export class PictureLocation {
  /**
   * 结构化地址信息
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public formatted_address?: string;

  /**
   * 坐标所在商圈信息
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public business?: string;

  /**
   * 国家
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public country?: string;

  /**
   * 国家代码
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public country_code?: string;

  /**
   * 省名
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public province!: string;

  /**
   * 城市名
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public city!: string;

  /**
   * 区县名
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public district!: string;

  /**
   * 乡镇名
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public town!: string;

  /**
   * 当前位置结合POI的语义化结果描述
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public pois: Poi[] = [];

  @Expose()
  public location!: {lng: number; lat: number};
}

// interface ILocation {
//   formatted_address: string;
//   business: string;
//   addressComponent: string;
//   country: string;
//   country_code: string;
//   country_code_iso: string;
//   country_code_iso2: string;
//   province: string;
//   city: string;
//   city_level: number;
//   district: string;
//   town: string;
//   town_code: string;
//   adcode: string;
//   street: string;
//   street_number: string;
//   direction: string;
//   distance: string;
//   roads: string[];
//   sematic_description: string;
//   poiRegions: {
//     direction_desc: '内';
//     name: '三福财富中心';
//     tag: '房地产;写字楼';
//     uid: 'aa84d1f34f9fc1257bf79659';
//     distance: '0';
//   };
// }
