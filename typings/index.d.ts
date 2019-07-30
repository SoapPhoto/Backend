type Maybe<T> = T | null;

type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };

type ID = string | number;

interface IEXIF {
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
