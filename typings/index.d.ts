export type Maybe<T> = T | null;

export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

export type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };

export interface IEXIF {
  aperture?: number;
  exposureTime?: string;
  focalLength?: number;
  iso?: string;
  gps?: [number, number];
}

