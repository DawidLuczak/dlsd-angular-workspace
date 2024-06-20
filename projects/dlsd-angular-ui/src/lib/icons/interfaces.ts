import { ICONS } from './icons';

export type IconCategory = keyof typeof ICONS;

export type IconName<C extends IconCategory> = keyof (typeof ICONS)[C];

export type IconSize<
  C extends IconCategory,
  N extends IconName<C>
> = (typeof ICONS)[C][N] extends readonly number[]
  ? (typeof ICONS)[C][N][number]
  : never;

export interface DLSDIcon<
  C extends IconCategory = IconCategory,
  N extends IconName<C> = IconName<C>,
  S extends IconSize<C, N> = IconSize<C, N>
> {
  category: C;
  name: N;
  size: S;
  scale?: number;
}
