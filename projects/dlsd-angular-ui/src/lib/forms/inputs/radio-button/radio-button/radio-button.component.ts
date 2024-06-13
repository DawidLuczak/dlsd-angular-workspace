import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Injector,
  OnInit,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels';

@Component({
  selector: 'dlsd-radio-button',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, DLSDInputLabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDRadioButtonComponent),
      multi: true,
    },
  ],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDRadioButtonComponent<T>
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor, OnInit
{
  public option = input.required<T>();
  public label = input<string>();

  protected onChange?: (value: T) => void;
  protected onTouched?: () => void;
  protected disabled = signal(false);
  protected active = signal(false);

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  public writeValue(value: T): void {
    this.active.set(value === this.option());
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.space', ['$event'])
  public handleAction(event: Event): void {
    if (this.disabled()) return;

    this.formControl?.control?.setValue(this.option());
    event.preventDefault();
  }
}
