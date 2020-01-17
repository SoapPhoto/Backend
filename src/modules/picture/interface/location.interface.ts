import { Exclude, Expose } from 'class-transformer';

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
   * 国家代码
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public country_code_iso?: string;

  /**
   * 国家代码
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public country_code_iso2?: string;

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

  @Expose()
  public city_level?: number;

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
   * 乡镇id
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public town_code?: string;

  /**
   * 行政区划代码
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public adcode?: string;

  /**
   * 街道名
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public street?: string;

  /**
   * 街道门牌号
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public street_number?: string;

  /**
   * 相对当前坐标点的方向，当有门牌号的时候返回数据
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public direction?: string;

  /**
   * 相对当前坐标点的距离，当有门牌号的时候返回数据
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public distance?: string;

  /**
   * 街道
   *
   * @type {string[]}
   * @memberof Location
   */
  @Expose()
  public roads?: string[];

  /**
   * 当前位置结合POI的语义化结果描述
   *
   * @type {string}
   * @memberof Location
   */
  @Expose()
  public sematic_description?: string;
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
