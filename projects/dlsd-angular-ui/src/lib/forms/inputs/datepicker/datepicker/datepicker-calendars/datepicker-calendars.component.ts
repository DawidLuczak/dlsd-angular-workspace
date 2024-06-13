import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  Injector,
  OnInit,
  effect,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from 'ng-let';

import { DLSDButtonComponent } from '../../../../../buttons';
import { I18N_NAMESPACE } from '../../../../../internal/constants';
import { MONTH_NAMES } from '../../constants';
import { DLSDCalendarRole, DLSDCalendarView } from '../../enums';
import { getDate } from '../../helpers';
import {
  DLSDDatepickerConfig,
  DLSDDatepickerDateRange,
  DLSD_DATEPICKER_CALENDARS_CONFIG,
} from '../../interfaces';
import { DLSDDatepickerCalendarHeadbarComponent } from './datepicker-calendar-headbar/datepicker-calendar-headbar.component';
import { DLSDDatepickerCalendarComponent } from './datepicker-calendar/datepicker-calendar.component';

@Component({
  selector: 'dlsd-datepicker-calendars',
  standalone: true,
  imports: [
    DLSDDatepickerCalendarComponent,
    DLSDDatepickerCalendarHeadbarComponent,
    DLSDButtonComponent,
    TranslateModule,
    NgLetModule,
    NgClass,
  ],
  templateUrl: './datepicker-calendars.component.html',
  styleUrl: './datepicker-calendars.component.scss',
})
export class DLSDDatepickerCalendarsComponent implements OnInit {
  protected readonly MONTH_NAMES = MONTH_NAMES;
  protected readonly CalendarView = DLSDCalendarView;
  protected readonly CalendarRole = DLSDCalendarRole;
  protected readonly I18N = `${I18N_NAMESPACE}.datepicker`;

  protected view = signal<DLSDCalendarView>(DLSDCalendarView.CALENDAR);
  protected today = signal<Date>(new Date());
  protected calendars = signal<{ from: Date[]; to: Date[] }>({
    from: [],
    to: [],
  });
  protected date = signal<DLSDDatepickerDateRange>({});
  protected disableDate = signal<
    (dateRange: DLSDDatepickerDateRange, date: Date) => boolean
  >(() => false);
  protected yearsRange = signal<number[]>([]);

  constructor(
    @Inject(DLSD_DATEPICKER_CALENDARS_CONFIG)
    protected config: DLSDDatepickerConfig,
    private injector: Injector
  ) {
    if (config.withDateRange) {
      this.disableDate.set(this.disableDateBeforeFromDate);
    }
  }

  public ngOnInit(): void {
    const today = getDate(this.today());
    const calendarDate = this.config.date().from ?? today;
    this.today.set(today);
    this.setCalendars(calendarDate);
    this.setYearsRange();

    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const date = this.config.date();
          this.date.set(date);

          if (date.from) this.setCalendars(date.from);
        },
        {
          allowSignalWrites: true,
        }
      );
    });
  }

  @HostListener('click')
  protected disableFocusout(): void {
    this.config.disableFocusout();
  }

  protected setDates(date: DLSDDatepickerDateRange, newDate: Date): void {
    if (this.config.withDateRange) {
      this.setDateRange(date, newDate);
    } else {
      date.from = newDate;
      this.config.changeDate(date);
    }
  }

  protected setDateRange(date: DLSDDatepickerDateRange, newDate: Date): void {
    if (!date.from) {
      date.from = newDate;
    } else if (!date.to) {
      date.to = newDate;
    } else {
      date.from = newDate;
      date.to = null;
    }
    this.config.changeDate(date);
  }

  protected clear(): void {
    this.date.set({});
    this.config.changeDate({});
  }

  protected changeView(view: DLSDCalendarView): void {
    if (view === DLSDCalendarView.CALENDAR) {
      this.setCalendars(this.calendars().from[0]);
    }

    this.view.set(view);
  }

  protected setRelativeDate(days: 0 | 1 | 2): void {
    const date = getDate(new Date());
    date.setDate(date.getDate() + days);
    this.date().from = date;
    this.config.changeDate(this.date());
  }

  protected selectCalendarYear(year: number): void {
    const date = this.calendars().from[0];
    date.setFullYear(year);
    this.setCalendars(date);
    this.view.set(DLSDCalendarView.CALENDAR);
  }

  protected selectCalendarMonth(month: number): void {
    const date = this.calendars().from[0];
    date.setMonth(month);
    this.setCalendars(date);
    this.view.set(DLSDCalendarView.CALENDAR);
  }

  protected changeCalendarMonth(value: -1 | 1): void {
    const date = this.calendars().from[0];
    date.setMonth(date.getMonth() + value);
    this.setCalendars(date);
  }

  protected setCalendars(date: Date): void {
    const calendars: { from: Date[]; to: Date[] } = {
      from: this.createCalendarDays(date),
      to: [],
    };
    if (this.config.withDateRange) {
      const toDate = new Date(date);
      toDate.setMonth(toDate.getMonth() + 1);
      calendars.to = this.createCalendarDays(toDate);
    }
    this.calendars.set(calendars);
  }

  private createCalendarDays(date: Date): Date[] {
    const calendar = [];
    const monthNumber = date.getMonth();
    let dayNumber = 1;
    let calendarDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);

    do {
      calendar.push(calendarDate);
      calendarDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        ++dayNumber
      );
    } while (calendarDate.getMonth() === monthNumber);

    return calendar;
  }

  private disableDateBeforeFromDate = (
    dateRange: DLSDDatepickerDateRange,
    date: Date
  ): boolean => {
    return !dateRange.to &&
      dateRange.from &&
      dateRange.from.getTime() > date.getTime()
      ? true
      : false;
  };

  private setYearsRange(): void {
    const years = [];
    let year = new Date().getFullYear() - this.config.yearsRange.past;
    const yearRange =
      year + this.config.yearsRange.past + this.config.yearsRange.future;

    do years.push(year);
    while (++year <= yearRange);

    this.yearsRange.set(years);
  }
}
