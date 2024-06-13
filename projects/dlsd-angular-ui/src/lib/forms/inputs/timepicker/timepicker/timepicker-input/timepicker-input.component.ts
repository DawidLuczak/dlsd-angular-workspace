import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnInit,
  effect,
  input,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { TimepickerTime } from '../../interfaces';

const TIME_REGEXP = /[0-2][0-9](:[0-5][0-9]){1,2}/;
const INTEGER_REGEXP = /^\d+$/;

@Component({
  selector: 'dlsd-timepicker-input',
  standalone: true,
  imports: [NgClass],
  templateUrl: './timepicker-input.component.html',
  styleUrl: './timepicker-input.component.scss',
})
export class DLSDTimepickerInputComponent implements OnInit {
  public value = input.required<TimepickerTime | undefined>();
  public control = input<NgControl | undefined>();
  public disabled = input<boolean>();
  public invalid = input<boolean>();

  @HostBinding('style.width') @Input() public width = '100%';

  public changeValue = output<TimepickerTime>();

  protected focusedOut = signal<boolean>(false);
  public get isFocusedOut() {
    return this.focusedOut();
  }

  private inputRef = viewChild.required<ElementRef>('input');

  constructor(private injector: Injector) {}

  public ngOnInit(): void {
    runInInjectionContext(this.injector, () =>
      effect(() => this.setInputValues(this.value()), {
        allowSignalWrites: true,
      })
    );
  }

  public focus(): void {
    this.getInputElements()[0].focus();
  }

  protected changeHour(event: Event): void {
    const input = event.target as HTMLInputElement;
    const data = (event as InputEvent).data!;

    if (!data && data !== '0') {
      input.value = '';
    } else if (Number(input.value) > 23) {
      input.value = data;
    }

    const value = {
      ...this.value(),
      hour: input.value.length ? Number(input.value) : undefined,
    };
    if (value.minute === undefined && input.value) {
      value.minute = 0;
      this.getInputElements()[2].value = '00';
    }
    this.changeValue.emit(value);
  }

  protected changeMinute(event: Event): void {
    const input = event.target as HTMLInputElement;
    const data = (event as InputEvent).data!;

    if (!data && data !== '0') {
      input.value = '';
    } else if (Number(input.value) > 59) {
      input.value = data;
    }

    this.changeValue.emit({
      ...this.value(),
      minute: input.value.length ? Number(input.value) : undefined,
    });
  }

  protected validateInput(event: KeyboardEvent, maxValue: number): boolean {
    if (INTEGER_REGEXP.test(event.key) && Number(event.key) < maxValue) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  protected clearTimeValues(): void {
    const inputs = this.getInputElements();
    inputs[0].value = '';
    inputs[2].value = '';
    this.changeValue.emit({});
  }

  protected pasteTime(event: ClipboardEvent): boolean {
    const value = event.clipboardData?.getData('text');
    if (!value || !TIME_REGEXP.test(value)) return false;

    const time = value.split(':').map((v) => Number(v));
    this.changeValue.emit({ hour: time[0], minute: time[1] });
    setTimeout(() => {
      this.getInputElements()[2].focus();
    });
    return false;
  }

  protected focusInputs(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.nodeName === 'INPUT' && target.value) {
      return;
    }

    const value = this.value();
    const inputs = this.getInputElements();
    if (value?.hour === undefined) {
      inputs[0].focus();
    } else if (value?.minute === undefined) {
      inputs[2].focus();
    } else {
      inputs[0].focus();
    }
  }

  protected focusPreviousInput(value?: number): void {
    if (value === undefined) {
      this.getInputElements()[0].focus();
    }
  }

  private getInputElements(): HTMLInputElement[] {
    return this.inputRef().nativeElement.children as HTMLInputElement[];
  }

  private setInputValues(value?: TimepickerTime): void {
    const inputs = this.getInputElements();
    if (value?.hour !== undefined) {
      const hour = String(value.hour);
      inputs[0].value = hour.length === 1 ? `0${hour}` : hour;

      if (value.hour > 2) {
        this.getInputElements()[2].focus();
      }
    }
    if (value?.minute !== undefined) {
      const minute = String(value.minute);
      inputs[2].value = minute.length === 1 ? `0${minute}` : minute;
    }
  }
}
