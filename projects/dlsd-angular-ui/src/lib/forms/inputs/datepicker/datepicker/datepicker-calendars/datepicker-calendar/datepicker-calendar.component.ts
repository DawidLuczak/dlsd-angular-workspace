import { DatePipe, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from 'ng-let';
import { DLSDButtonComponent } from '../../../../../../buttons';
import { I18N_NAMESPACE } from '../../../../../../internal/constants';
import { WEEK_DAY_NAMES } from '../../../constants';
import { DLSDCalendarRole } from '../../../enums';
import { DLSDDatepickerDateRange } from '../../../interfaces';

@Component({
  selector: 'dlsd-datepicker-calendar',
  standalone: true,
  imports: [
    DLSDButtonComponent,
    TranslateModule,
    NgLetModule,
    DatePipe,
    NgClass,
  ],
  templateUrl: './datepicker-calendar.component.html',
  styleUrl: './datepicker-calendar.component.scss',
})
export class DLSDDatepickerCalendarComponent {
  protected readonly WEEK_DAY_NAMES = WEEK_DAY_NAMES;
  protected readonly I18N = `${I18N_NAMESPACE}.datepicker`;
  protected readonly CalendarRole = DLSDCalendarRole;

  public today = input.required<Date>();
  public calendar = input.required<Date[]>();
  public dateRange = input.required<DLSDDatepickerDateRange>();
  public disableDate =
    input.required<
      (dateRange: DLSDDatepickerDateRange, date: Date) => boolean
    >();

  public changeDate = output<Date>();
}
