import { Signal } from '@angular/core';
import { DLSDToastColor } from './enums';

export interface DLSDToast {
  color: DLSDToastColor;
  message: string;
  keepOnNavigation?: boolean;
}

export interface DLSDToasterConfig {
  readonly toasts: Signal<DLSDToast[]>;
  readonly hideToast: (toast: DLSDToast) => void;
}
