import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { NgLetModule } from 'ng-let';
import { CalendarRole, CalendarView } from '../../../enums';

@Component({
  selector: 'dlsd-datepicker-calendar-headbar',
  standalone: true,
  imports: [NgClass, NgLetModule, DatePipe],
  templateUrl: './datepicker-calendar-headbar.component.html',
  styleUrl: './datepicker-calendar-headbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDDatepickerCalendarHeadbarComponent {
  protected readonly CalendarView = CalendarView;
  protected readonly CalendarRole = CalendarRole;

  public view = model.required<CalendarView>();
  public date = input.required<Date>();
  public allowOpenChange = input<boolean>(true);
  public calendarRole = input<CalendarRole>(CalendarRole.FROM);

  public changeMonth = output<-1 | 1>();

  protected changeView(view: CalendarView): void {
    if (!this.allowOpenChange()) return;

    this.view.update((currentView) =>
      currentView !== view ? view : CalendarView.CALENDAR
    );
  }
}
