export type Maybe<T> = T | null;

export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

export type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };

export interface IEXIF {
  meteringMode?: string;
  exposureMode?: string;
  exposureBias?: string;
  date?: string;
  software?: string;
  location?: number[];
  camera?: string;
  focalLength?: string;
  aperture?: string;
  exposureTime?: string;
  ISO?: string;
}

