import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  input,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgLetModule } from 'ng-let';
import { take } from 'rxjs';

import { DLSDDropdownService } from '../../../../view/dropdown';
import { DLSDFormControlErrorComponent } from '../../../controls';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels/input-label/input-label.component';
import {
  DLSD_DATEPICKER_CALENDARS_CONFIG,
  DLSDDatepickerDateRange,
  DLSDDatepickerYearsRange,
} from '../interfaces';
import { DLSDDatepickerCalendarsComponent } from './datepicker-calendars/datepicker-calendars.component';
import { DLSDDatepickerInputComponent } from './datepicker-input/datepicker-input.component';

@Component({
  selector: 'dlsd-datepicker',
  standalone: true,
  imports: [
    DLSDInputLabelComponent,
    DLSDDatepickerInputComponent,
    DLSDFormControlErrorComponent,
    FormsModule,
    DatePipe,
    NgLetModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDDatepickerComponent),
      multi: true,
    },
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDDatepickerComponent
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor, AfterViewInit
{
  @HostBinding('style.width') @Input() public width = '100%';

  public label = input<string>();
  public hint = input<string>();
  public showRelativeDays = input<boolean>(false);
  public withDateRange = input<boolean>(false);
  public yearsRange = input<DLSDDatepickerYearsRange>({ past: 20, future: 0 });

  protected onChange?: (value: DLSDDatepickerDateRange | Date | null) => void;
  protected onTouched?: () => void;
  protected disabled = signal<boolean>(false);
  protected value = signal<DLSDDatepickerDateRange>({});

  private inputFromDate =
    viewChild.required<DLSDDatepickerInputComponent>('inputFromDateRef');
  private inputToDate =
    viewChild<DLSDDatepickerInputComponent>('inputToDateRef');
  private allowFocusout = signal<boolean>(false);
  private isCalendarAttached = signal<boolean>(false);

  constructor(
    protected override injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private dropdownService: DLSDDropdownService
  ) {
    super(injector);
  }

  public ngAfterViewInit(): void {
    const value = this.value();
    if (!value) return;

    this.inputFromDate().setDate(value?.from);
    this.inputToDate()?.setDate(value?.to);
  }

  public writeValue(value: DLSDDatepickerDateRange | Date | null): void {
    if (!value) {
      this.value.set({});
    } else if (value instanceof Date) {
      this.value.set({ from: value as Date });
    } else {
      this.value.set(value as DLSDDatepickerDateRange);
    }
  }

  public registerOnChange(
    fn: (value: DLSDDatepickerDateRange | Date | null) => void
  ): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected changeDateFromValue(from: Date | null): void {
    const value = this.value();
    if (value.from === from) return;

    this.changeDateValue({
      ...value,
      from,
    });
  }

  protected changeDateToValue(to: Date | null): void {
    const date = this.value();
    if (date.to === to) return;

    this.changeDateValue({
      ...date,
      to,
    });
  }

  protected enableFocusout(): void {
    this.allowFocusout.set(true);
  }

  protected focusoutCloseFromCalendar(): void {
    if (this.withDateRange()) return;

    this.focusoutCloseCalendar();
  }

  protected focusoutCloseCalendar(): void {
    setTimeout(() => {
      if (this.allowFocusout() && this.isCalendarAttached()) {
        this.dropdownService.detachDropdown();
        this.onTouched?.();
      }
    }, 100);
  }

  protected openCalendarAfterFocusin(event: Event): void {
    event.stopPropagation();
    this.allowFocusout.set(false);
    if (this.isCalendarAttached()) return;

    this.attachCalendar();
  }

  protected openCalendarAndFocus(
    event: Event,
    inputComponent: DLSDDatepickerInputComponent
  ): void {
    event.stopPropagation();
    if (this.disabled()) return;

    inputComponent.focusInputs(event);
    this.allowFocusout.set(false);
    this.attachCalendar();
  }

  protected clearValues(): void {
    this.changeDateValue({ from: null, to: null });
    this.inputFromDate().setDate(null);
    this.inputToDate()?.setDate(null);
  }

  private attachCalendar(): void {
    this.dropdownService.attachDropdown(
      this.inputFromDate().inputRef(),
      this.viewContainerRef,
      DLSDDatepickerCalendarsComponent,
      DLSD_DATEPICKER_CALENDARS_CONFIG,
      {
        hostCss: ['fill'],
        date: this.value,
        changeDate: (value: DLSDDatepickerDateRange | null) =>
          this.changeCalendarDate(value),
        disableFocusout: () => this.allowFocusout.set(false),
        showRelativeDays: this.showRelativeDays(),
        withDateRange: this.withDateRange(),
        yearsRange: this.yearsRange(),
      }
    );
    this.isCalendarAttached.set(true);
    this.dropdownService.detach$
      .pipe(take(1))
      .subscribe(() => this.isCalendarAttached.set(false));
  }

  private changeCalendarDate(value: DLSDDatepickerDateRange | null): void {
    this.changeDateValue(value ?? {});
    this.inputFromDate().setDate(value?.from);
    this.inputToDate()?.setDate(value?.to);
  }

  private changeDateValue(value: DLSDDatepickerDateRange): void {
    this.value.set(value);
    this.onChange?.(this.withDateRange() ? value : value.from ?? null);
    this.onTouched?.();
  }
}
