import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgLetModule } from 'ng-let';
import { DLSDClearButtonComponent } from '../../../../../buttons';
import { DLSDFormControlErrorComponent } from '../../../../controls';

const INTEGER_REGEXP = /^\d+$/;
const DATE_REGEXP = /20[0-9]{2}-[0-1][0-9]-[0-3][0-9]/;

@Component({
  selector: 'dlsd-datepicker-input',
  standalone: true,
  imports: [
    DLSDFormControlErrorComponent,
    DLSDClearButtonComponent,
    NgLetModule,
    NgClass,
  ],
  templateUrl: './datepicker-input.component.html',
  styleUrl: './datepicker-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDDatepickerInputComponent {
  public disabled = input<boolean>();
  public invalid = input<boolean>();
  public control = input<NgControl | undefined>();

  public changeValue = output<Date | null>();
  public clearValues = output<void>();

  public inputRef = viewChild.required<ElementRef>('inputRef');

  protected date = signal<{
    year?: number;
    month?: number;
    day?: number;
  }>({});

  public setDate(date?: Date | null): void {
    if (!date) {
      this.date.set({});
      this.clearInput();
      return;
    }

    const newDate = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getDate(),
    };

    this.date.set(newDate);
    this.updateDateInputs(newDate);
  }

  public focusInputs(event: Event): void {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (input.nodeName === 'INPUT' && !!input.value) {
      input.setSelectionRange(0, input.value.length);
      return;
    }

    const date = this.date();
    if (!date.day) {
      this.focusInputElement(0);
    } else if (!date.month) {
      this.focusInputElement(2);
    } else if (!date.year) {
      this.focusInputElement(4);
    } else {
      this.focusInputElement(0);
    }
  }

  public focusDayInput(): void {
    this.focusInputElement(0);
  }

  protected clearValue(): void {
    this.clearValues.emit();
  }

  protected onfocusout(event: Event, value?: number | boolean): void {
    if (!value) return;

    event.stopPropagation();
  }

  protected focus(value: number | undefined, index: 0 | 2 | 4): void {
    if (!value) {
      this.focusInputElement(index);
    }
  }

  protected changeDay(event: Event): void {
    const input = event.target as HTMLInputElement;
    const data = (event as InputEvent).data!;
    this.date().day = Number(input.value);

    if (Number(input.value) > 31) {
      input.value = `0${data}`;
      if (Number(data) > 3) {
        this.focusInputElement(2);
      }
    } else if (input.value.length === 1) {
      if (data && data !== '0') {
        input.value = `0${data}`;
        if (Number(data) > 3) {
          this.focusInputElement(2);
        }
      }
    } else if (input.value.length > 1 && Number(input.value) < 1) {
      input.value = '01';
      this.focusInputElement(2);
    } else if (data) {
      if (input.value.length > 2) {
        input.value = `${input.value[1]}${data}`;
      }
      this.focusInputElement(2);
    }

    this.date().day = Number(input.value);
    this.changeDate();
  }

  protected changeMonth(event: Event): void {
    const input = event.target as HTMLInputElement;
    const data = (event as InputEvent).data!;
    this.date().month = Number(input.value);

    if (Number(input.value) > 12) {
      input.value = `0${data}`;
      if (Number(data) > 1) {
        this.focusInputElement(4);
      }
    } else if (input.value.length === 1) {
      if (data && data !== '0') {
        input.value = `0${data}`;
        if (Number(data) > 1) {
          this.focusInputElement(4);
        }
      }
    } else if (input.value.length > 1 && Number(input.value) < 1) {
      input.value = '01';
      this.focusInputElement(4);
    } else if (data) {
      if (input.value.length > 2) {
        input.value = `${input.value[1]}${data}`;
      }
      this.focusInputElement(4);
    } else {
      this.focusInputElement(0);
    }

    this.date().month = Number(input.value);
    this.changeDate();
  }

  protected changeYear(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length < 4) {
      this.date().year = undefined;
      if (input.value.length === 0) this.focusInputElement(2);
    } else {
      this.date().year = Number(input.value);
    }

    this.changeDate();
  }

  protected previousInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      (
        input.previousElementSibling?.previousElementSibling as HTMLElement
      ).focus();
    }
  }

  protected validateInput(event: KeyboardEvent): boolean {
    if (INTEGER_REGEXP.test(event.key)) return true;

    event.preventDefault();
    return false;
  }

  protected pasteDate(event: ClipboardEvent): boolean {
    const value = event.clipboardData?.getData('text');
    if (!value || !DATE_REGEXP.test(value)) return false;

    const date = new Date(value);
    this.setDate(date);
    this.changeDate();
    setTimeout(() => {
      this.focusInputElement(4);
    });
    return false;
  }

  private changeDate(): void {
    const { year, month, day } = this.date();
    if (!year || !month || !day) {
      this.changeValue.emit(null);
      return;
    }

    const date = new Date(year, month - 1, day);
    this.changeValue.emit(date);
  }

  private updateDateInputs(date: {
    year: number;
    month: number;
    day: number;
  }): void {
    const inputs = this.getInputElements();
    const month = String(date.month);
    const day = String(date.day);
    inputs[0].value = day.length === 1 ? `0${day}` : day;
    inputs[2].value = month.length === 1 ? `0${month}` : month;
    inputs[4].value = String(date.year);
  }

  private clearInput(): void {
    const inputs = this.getInputElements();
    inputs[0].value = '';
    inputs[2].value = '';
    inputs[4].value = '';
  }

  private focusInputElement(index: 0 | 2 | 4): void {
    const input = this.getInputElements()[index];
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }

  private getInputElements(): HTMLInputElement[] {
    return this.inputRef().nativeElement.firstElementChild!
      .children as HTMLInputElement[];
  }
}
