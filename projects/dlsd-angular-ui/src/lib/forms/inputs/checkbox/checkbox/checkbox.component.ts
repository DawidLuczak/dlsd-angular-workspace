import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostListener,
  Injector,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels';

@Component({
  selector: 'dlsd-checkbox',
  standalone: true,
  imports: [FormsModule, NgClass, DLSDInputLabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDCheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDCheckboxComponent
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor
{
  public value = model<boolean>(false);
  public label = input<string>();
  public interdeteminate = input<boolean>(false);

  protected onChange?: (value: boolean) => void;
  protected onTouched?: () => void;
  protected disabled = signal<boolean>(false);

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  public writeValue(value: boolean): void {
    this.value.set(value);
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected switchValue(event: Event): void {
    if (this.disabled()) return;

    this.changeValue(!this.value());
    event.preventDefault();
  }

  protected changeValue(value: boolean): void {
    this.value.set(value);
    this.onChange?.(value);
    this.onTouched?.();
  }
}
