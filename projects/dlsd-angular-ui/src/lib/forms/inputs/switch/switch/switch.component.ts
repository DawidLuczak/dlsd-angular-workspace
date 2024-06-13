import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Injector,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels';

@Component({
  selector: 'dlsd-switch',
  standalone: true,
  imports: [NgClass, DLSDInputLabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDSwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDSwitchComponent
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor
{
  public value = model<boolean>(false);
  public label = input<string>();
  public size = input<'s' | 'm' | 'l'>('l');

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
  protected changeValue(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();

    this.value.update((value) => !value);
    this.onChange?.(this.value());
  }
}
