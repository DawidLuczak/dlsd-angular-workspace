import { InjectionToken, WritableSignal } from '@angular/core';
import { DLSDCustomOverlayConfig } from '../../../overlay/interfaces';

export const DLSD_DATEPICKER_CALENDARS_CONFIG =
  new InjectionToken<DLSDDatepickerConfig>('Datepicker calendars config');

export interface DLSDDatepickerConfig extends DLSDCustomOverlayConfig {
  changeDate: (value: DLSDDatepickerDateRange | null) => void;
  date: WritableSignal<DLSDDatepickerDateRange>;
  disableFocusout: () => void;
  showRelativeDays?: boolean;
  withDateRange: boolean;
  yearsRange: DLSDDatepickerYearsRange;
}

export interface DLSDDatepickerDateRange {
  from?: Date | null;
  to?: Date | null;
}

export interface DLSDDatepickerYearsRange {
  past: number;
  future: number;
}
