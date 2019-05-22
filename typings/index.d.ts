export type Maybe<T> = T | null;

export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

export type MutablePartial<T> = { -readonly [P in keyof T]?: T[P] };
