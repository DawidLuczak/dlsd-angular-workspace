import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels';
import { TimepickerTime, TimepickerTimeRange } from '../interfaces';
import { DLSDTimepickerInputComponent } from './timepicker-input/timepicker-input.component';

@Component({
  selector: 'dlsd-timepicker',
  standalone: true,
  imports: [DLSDTimepickerInputComponent, DLSDInputLabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DLSDTimepickerComponent),
    },
  ],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDTimepickerComponent
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor
{
  public label = input<string>();
  public hint = input<string>();
  public withTimeRange = input<boolean>(false);

  protected onChange?: (
    value: TimepickerTimeRange | TimepickerTime | null
  ) => void;
  protected onTouched?: () => void;
  protected value = signal<TimepickerTimeRange>({});
  protected disabled = signal<boolean>(false);

  private inputTimeToRef =
    viewChild<DLSDTimepickerInputComponent>('inputTimeToRef');

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public writeValue(value: TimepickerTimeRange | TimepickerTime | null): void {
    if (!value) {
      this.value.set({ from: {}, to: {} });
    } else if (this.withTimeRange()) {
      this.value.set(value as TimepickerTimeRange);
    } else {
      this.value.set({ from: value as TimepickerTime });
    }
  }

  public registerOnChange(
    fn: (value: TimepickerTimeRange | TimepickerTime | null) => void
  ): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected changeValue(value: TimepickerTimeRange): void {
    const newValue = { ...this.value(), ...value };
    this.value.set(newValue);
    this.onChange?.((this.withTimeRange() ? newValue : newValue.from) ?? null);
  }

  protected focusoutOnTouched(inputFrom: DLSDTimepickerInputComponent): void {
    if (!(inputFrom.isFocusedOut && this.inputTimeToRef()?.isFocusedOut)) {
      return;
    }

    this.onTouched?.();
  }
}
