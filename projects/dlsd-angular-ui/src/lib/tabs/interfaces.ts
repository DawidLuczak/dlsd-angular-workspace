interface DLSDTabBase<T> {
  value: T;
  disabled?: boolean;
}

export interface DLSDTabText<T> extends DLSDTabBase<T> {
  name: string;
  count?: number;
}

export type DLSDTab<T> = DLSDTabText<T>;
