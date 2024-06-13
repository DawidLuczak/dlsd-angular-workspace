import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  input,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface Error {
  code: string;
  value: any;
}

@Component({
  selector: 'dlsd-form-control-error',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './form-control-error.component.html',
  styleUrls: ['./form-control-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDFormControlErrorComponent implements OnInit {
  protected readonly I18N = 'dlsdAngularUi.errors.';

  public formControls = input.required<(NgControl | AbstractControl)[]>();
  public size = input<'s' | 'm'>('m');

  private formGroupDirective?: FormGroupDirective;

  protected get error(): Error | null {
    for (const formControl of this.formControls()) {
      const errors = formControl.errors;
      const isDirty = formControl.dirty! && formControl.touched!;
      const isSubmitted = this.formGroupDirective?.submitted;

      if (errors && (isDirty || isSubmitted)) {
        const [errorCode, errorValue] = Object.entries(formControl.errors)[0];
        return this.transformError(errorCode, errorValue);
      }
    }

    return null;
  }

  constructor(private injector: Injector) {}

  public ngOnInit(): void {
    this.formGroupDirective =
      this.injector.get(FormGroupDirective, undefined, {
        optional: true,
      }) ?? undefined;
  }

  private transformError(errorCode: string, errorValue: any): Error {
    if (errorCode === 'min' && errorValue.min === Number.EPSILON) {
      return { code: 'minEpsilon', value: null };
    }

    const transformedValue =
      {
        min: errorValue.min,
        max: errorValue.max,
        minlength: errorValue.requiredLength,
        maxlength: errorValue.requiredLength,
      }[errorCode] ?? errorValue;

    return {
      code: errorCode,
      value: transformedValue,
    };
  }
}
