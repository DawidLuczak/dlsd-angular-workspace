import { DLSDToastColor, DLSDToastType } from './enums';

export const DEFAULT_TOAST_COLORS: Record<DLSDToastType, DLSDToastColor> = {
  [DLSDToastType.INVALID_DATA]: DLSDToastColor.RED,
  [DLSDToastType.SERVER_ERROR]: DLSDToastColor.YELLOW,
  [DLSDToastType.SAVED_CHANGES]: DLSDToastColor.GREEN,
} as const;
