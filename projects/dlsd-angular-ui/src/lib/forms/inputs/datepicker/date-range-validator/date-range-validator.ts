import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DLSDDatepickerDateRange } from '../interfaces';

export const dlsdDateRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) {
    return control.hasValidator(Validators.required)
      ? { required: true }
      : null;
  }

  const { from, to } = control.value as DLSDDatepickerDateRange;
  if (!from || !to) {
    return control.hasValidator(Validators.required)
      ? { required: true }
      : null;
  }

  return from.getTime() > to.getTime() ? { dateRange: true } : null;
};
