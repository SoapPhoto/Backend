export type Maybe<T> = T | null;

export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

export type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };

export type ID = string | number;

export interface IEXIF {
  meteringMode?: string;
  exposureMode?: string;
  exposureBias?: string;
  date?: string;
  software?: string;
  location?: number[];
  make?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  exposureTime?: string;
  ISO?: string;
}

