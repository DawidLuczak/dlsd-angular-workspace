import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormGroupDirective, NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'dlsd-base-form-control',
  standalone: true,
  imports: [],
  template: ``,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDBaseFormControlComponent implements OnInit {
  protected formControl?: NgControl;
  private formGroupDirective?: FormGroupDirective;

  protected get isRequired(): boolean {
    const control = this.formControl?.control;
    if (!control) return false;

    return (
      control.hasValidator(Validators.required) ||
      control.hasValidator(Validators.requiredTrue)
    );
  }

  protected get isValid(): boolean {
    return this.formControl?.valid ?? false;
  }

  protected get isInvalid(): boolean {
    if (!this.formGroupDirective || !this.formControl) return false;

    const isInvalid = this.formControl.invalid!;
    const isDirty = this.formControl.dirty! && this.formControl.touched!;
    const isSubmitted = this.formGroupDirective.submitted;

    return isInvalid && (isDirty || isSubmitted);
  }

  constructor(protected injector: Injector) {}

  public ngOnInit(): void {
    this.formGroupDirective =
      this.injector.get(FormGroupDirective, undefined, {
        optional: true,
      }) ?? undefined;
    if (!this.formGroupDirective) return;

    this.formControl =
      this.injector.get(NgControl, undefined, {
        optional: true,
      }) ?? undefined;
  }
}
