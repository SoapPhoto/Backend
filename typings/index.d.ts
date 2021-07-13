type Maybe<T> = T | null;

type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };

type RecordPartial<K extends keyof any, T> = {
  [P in K]?: T;
};

type ID = string | number;

interface ISelectOptions {
  info?: import('graphql').GraphQLResolveInfo;
  value?: string;
  select?: string[];
  /** 取消掉orderBy createDate */
  orderBy?: boolean;
  [key: string]: any;
}

interface IEXIF {
  orientation?: number;
  meteringMode?: string;
  exposureMode?: string;
  exposureBias?: string;
  date?: string;
  software?: string;
  location?: [number, number];
  make?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  exposureTime?: string;
  ISO?: string;
}
