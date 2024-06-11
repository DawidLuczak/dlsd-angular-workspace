import { InjectionToken, WritableSignal } from '@angular/core';
import { CustomOverlayConfig } from '../../overlay/interfaces';

export const DATEPICKER_CALENDARS_CONFIG = new InjectionToken<DatepickerConfig>(
  'Datepicker calendars config'
);

export interface DatepickerConfig extends CustomOverlayConfig {
  changeDate: (value: DatepickerDateRange | null) => void;
  date: WritableSignal<DatepickerDateRange>;
  disableFocusout: () => void;
  showRelativeDays?: boolean;
  withDateRange: boolean;
  yearsRange: DatepickerYearsRange;
}

export interface DatepickerDateRange {
  from?: Date | null;
  to?: Date | null;
}

export interface DatepickerYearsRange {
  past: number;
  future: number;
}
