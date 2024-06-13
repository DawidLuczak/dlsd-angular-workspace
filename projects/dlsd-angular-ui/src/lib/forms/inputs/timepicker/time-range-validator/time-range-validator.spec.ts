import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { TimepickerTimeRange } from '../interfaces';
import { dlsdTimeRangeValidator } from './time-range-validator';

describe('dlsdTimeRangeRequiredValidator', () => {
  let timeRangeFormControl: FormControl<TimepickerTimeRange | null>;
  let timeRangeControlErrors: ValidationErrors | null;

  beforeEach(() => {
    timeRangeFormControl = new FormControl(null, dlsdTimeRangeValidator);
    timeRangeFormControl.markAsTouched();
    timeRangeFormControl.markAsDirty();
  });

  describe('should contain a dateRange error, if the time range value is set', () => {
    it('and when the from time is not before the to time in hours', () => {
      const from = { hour: 12, minute: 30 };
      const to = { hour: 12, minute: 29 };
      timeRangeFormControl.setValue({ from, to });
      timeRangeControlErrors = timeRangeFormControl.getError('timeRange');
      expect(timeRangeControlErrors).toBeTrue();
    });

    it('and when the from time is not before the to time in minutes', () => {
      const from = { hour: 13, minute: 30 };
      const to = { hour: 12, minute: 30 };
      timeRangeFormControl.setValue({ from, to });
      timeRangeControlErrors = timeRangeFormControl.getError('timeRange');
      expect(timeRangeControlErrors).toBeTrue();
    });
  });

  describe('should not contain errors, ', () => {
    it('when the time range value is not complete set', () => {
      timeRangeControlErrors = timeRangeFormControl.errors;
      expect(timeRangeControlErrors).toBeNull();

      timeRangeFormControl.setValue({ from: {} });
      timeRangeControlErrors = timeRangeFormControl.errors;
      expect(timeRangeControlErrors).toBeNull();

      timeRangeFormControl.setValue({ to: {} });
      timeRangeControlErrors = timeRangeFormControl.errors;
      expect(timeRangeControlErrors).toBeNull();
    });

    describe('when the from time is before the to time', () => {
      it('in hours', () => {
        const from = { hour: 10, minute: 10 };
        const to = { hour: 11, minute: 10 };
        timeRangeFormControl.setValue({ from, to });
        timeRangeControlErrors = timeRangeFormControl.errors;
        expect(timeRangeControlErrors).toBeNull();
      });

      it('in minutes', () => {
        const from = { hour: 10, minute: 10 };
        const to = { hour: 10, minute: 11 };
        timeRangeFormControl.setValue({ from, to });
        timeRangeControlErrors = timeRangeFormControl.errors;
        expect(timeRangeControlErrors).toBeNull();
      });
    });
  });

  describe('if has required validator', () => {
    beforeEach(() => {
      timeRangeFormControl.addValidators(Validators.required);
    });

    it('should contain required error, when the time range value is not set, ', () => {
      timeRangeFormControl.setValue({});
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();
    });

    it('should contain required error, when the time range value is not complete, ', () => {
      timeRangeFormControl.setValue({ from: {}, to: {} });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();

      timeRangeFormControl.setValue({
        from: { hour: 1, minute: 1 },
        to: { hour: 1 },
      });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();

      timeRangeFormControl.setValue({
        from: { hour: 1, minute: 1 },
        to: { minute: 1 },
      });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();

      timeRangeFormControl.setValue({
        from: { hour: 1 },
        to: { hour: 1, minute: 1 },
      });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();

      timeRangeFormControl.setValue({
        from: { minute: 1 },
        to: { hour: 1, minute: 1 },
      });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeTrue();
    });

    it('should not contain required error, when the time range value is set, ', () => {
      const from = { hour: 0, minute: 1 };
      const to = { hour: 1, minute: 0 };
      timeRangeFormControl.setValue({ from, to });
      timeRangeControlErrors = timeRangeFormControl.getError('required');
      expect(timeRangeControlErrors).toBeNull();
    });
  });
});
