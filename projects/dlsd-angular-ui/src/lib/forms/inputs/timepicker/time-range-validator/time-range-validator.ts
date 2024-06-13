import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TimepickerTimeRange } from '../interfaces';

export const dlsdTimeRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) {
    return control.hasValidator(Validators.required)
      ? { required: true }
      : null;
  }

  const { from, to } = control.value as TimepickerTimeRange;
  if (
    to?.minute === undefined ||
    to.hour === undefined ||
    from?.hour === undefined ||
    from.minute === undefined
  ) {
    return control.hasValidator(Validators.required)
      ? { required: true }
      : null;
  }

  if (
    from.hour > to.hour ||
    (from.hour === to.hour && from.minute > to.minute)
  ) {
    return { timeRange: true };
  }

  return null;
};
