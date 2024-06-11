import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { DatepickerDateRange } from '../interfaces';
import { dateRangeValidator } from './date-range-validator';

describe('dateRangeValidator', () => {
  let dateRangeFormControl: FormControl<DatepickerDateRange | null>;
  let dateRangeControlErrors: ValidationErrors | null;

  beforeEach(() => {
    dateRangeFormControl = new FormControl(null, dateRangeValidator);
    dateRangeFormControl.markAsTouched();
    dateRangeFormControl.markAsDirty();
  });

  it('should not contain errors, when the from date is before the to date', () => {
    const from = new Date();
    const to = new Date();
    to.setMinutes(from.getMinutes() + 1);
    dateRangeFormControl.setValue({ from, to });
    dateRangeControlErrors = dateRangeFormControl.errors;
    expect(dateRangeControlErrors).toBeNull();
  });

  describe('when the date range value is not complete', () => {
    it('should not contain errors', () => {
      dateRangeControlErrors = dateRangeFormControl.errors;
      expect(dateRangeControlErrors).toBeNull();

      dateRangeFormControl.setValue({ from: new Date() });
      dateRangeControlErrors = dateRangeFormControl.errors;
      expect(dateRangeControlErrors).toBeNull();

      dateRangeFormControl.setValue({ to: new Date() });
      dateRangeControlErrors = dateRangeFormControl.errors;
      expect(dateRangeControlErrors).toBeNull();
    });

    it('should contain required error, if required validator is set', () => {
      dateRangeFormControl.addValidators(Validators.required);

      dateRangeFormControl.setValue(null);
      dateRangeControlErrors = dateRangeFormControl.getError('required');
      expect(dateRangeControlErrors).toBeTrue();

      dateRangeFormControl.setValue({ from: new Date() });
      dateRangeControlErrors = dateRangeFormControl.getError('required');
      expect(dateRangeControlErrors).toBeTrue();

      dateRangeFormControl.setValue({ to: new Date() });
      dateRangeControlErrors = dateRangeFormControl.getError('required');
      expect(dateRangeControlErrors).toBeTrue();
    });
  });

  describe('should contain a dateRange error', () => {
    it('when the from date is not before the to date', () => {
      const from = new Date();
      const to = new Date();
      to.setMinutes(from.getMinutes() - 1);
      dateRangeFormControl.setValue({ from, to });
      dateRangeControlErrors = dateRangeFormControl.getError('dateRange');
      expect(dateRangeControlErrors).toBeTrue();
    });
  });
});
