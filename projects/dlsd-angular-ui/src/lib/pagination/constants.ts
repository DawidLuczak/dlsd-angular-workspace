import { DLSDOption } from '../view/dropdown/index';

export const PAGINATION_LIMIT_OPTIONS: DLSDOption<number>[] = [
  { name: '20', value: 20 },
  { name: '30', value: 30 },
  { name: '40', value: 40 },
  { name: '50', value: 50 },
];

export const PAGINATION_DEFAULT_LIMIT = PAGINATION_LIMIT_OPTIONS[0].value;
