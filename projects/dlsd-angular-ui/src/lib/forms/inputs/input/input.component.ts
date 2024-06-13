import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DLSDClearButtonComponent } from '../../../buttons';
import { DLSDFormControlErrorComponent } from '../../controls';
import { DLSDBaseFormControlComponent } from '../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../labels';

const INTEGER_REGEXP = /^\d+$/;
const FLOAT_REGEXP = /^\d+[,.]?\d{0,2}$/;

@Component({
  selector: 'dlsd-input',
  standalone: true,
  imports: [
    DLSDClearButtonComponent,
    DLSDInputLabelComponent,
    DLSDFormControlErrorComponent,
    NgClass,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDInputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDInputComponent<T>
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor
{
  @HostBinding('style.width') @Input() public width = '100%';

  public size = input.required<'s' | 'm'>();
  public type = input<'text' | 'email' | 'password' | 'url'>('text');
  public label = input<string>();
  public hint = input<string>();
  public autocomplete = input<string>();
  public placeholder = input<string>();
  public unit = input<string>();
  public integer = input<boolean>(false);
  public float = input<boolean>(false);
  public maxLength = input<number>();
  public showErrors = input<boolean>(true);
  public disabled = model<boolean>(false);
  public showPassword = model<boolean | null>(null);

  @Input() public set value(value: T | null) {
    if (value == null) {
      this.clearInput();
      return;
    }

    if (this.integer() || this.float()) {
      const pattern = this.integer() ? INTEGER_REGEXP : FLOAT_REGEXP;
      if (!pattern.test(value.toString())) return;
    }

    this.value_.set(value);
    setTimeout(() => (this.inputRef().nativeElement.value = value.toString()));
  }
  public get value(): T | null {
    return this.value_() ?? null;
  }

  public valueChange = output<T | null>();

  protected onChange?: (value: T | null) => void;
  protected onTouched?: () => void;
  protected value_ = signal<T | undefined>(undefined);
  protected computedType = computed(() => {
    if (this.showPassword() == null) return this.type();
    return this.showPassword() ? 'text' : 'password';
  });
  protected maxLengthHint = computed(() => {
    if (this.maxLength() == null) return undefined;
    return `${this.value_()?.toString()?.length ?? 0}/${this.maxLength()}`;
  });

  private inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  public writeValue(value: T | null): void {
    this.value = value;
  }

  public focus(): void {
    if (this.disabled()) return;
    this.inputRef().nativeElement.focus();
  }

  protected validateInput(event: KeyboardEvent): boolean {
    if (!(this.integer() || this.float())) return true;

    const { value, selectionStart, selectionEnd } =
      event.target as HTMLInputElement;
    const newValue =
      value.slice(0, selectionStart!) + event.key + value.slice(selectionEnd!);

    const pattern = this.integer() ? INTEGER_REGEXP : FLOAT_REGEXP;
    if (pattern.test(newValue)) return true;

    event.preventDefault();
    return false;
  }

  protected validatePaste(event: ClipboardEvent): boolean {
    if (!(this.integer() || this.float())) return true;

    const { value, selectionStart, selectionEnd } =
      event.target as HTMLInputElement;
    const pasteData = event.clipboardData?.getData('text') ?? '';
    const newValue =
      value.slice(0, selectionStart!) + pasteData + value.slice(selectionEnd!);

    const pattern = this.integer() ? INTEGER_REGEXP : FLOAT_REGEXP;
    if (pattern.test(newValue)) {
      const numberValue = Number(newValue);
      this.onChange?.(numberValue as T);
      this.valueChange.emit(numberValue as T);
      this.inputRef().nativeElement.value = newValue;
    }

    event.preventDefault();
    return false;
  }

  protected clearInput(): void {
    this.value_.set(undefined);
    this.onChange?.(null);
    this.valueChange.emit(null);
    setTimeout(() => (this.inputRef().nativeElement.value = ''));
  }

  protected switchShowPassword(): void {
    this.showPassword.update((showPassword) => !showPassword);
  }

  protected handleValueChange(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    if (this.maxLength() != null) {
      value = value.slice(0, this.maxLength());
    }
    this.value_.set(value as T);

    if (this.integer() || this.float()) {
      value = value.replace(',', '.').replace(/^0(?=[0-9])/, '');
      const pattern = this.integer() ? INTEGER_REGEXP : FLOAT_REGEXP;

      if (!value) {
        this.onChange?.(null);
        this.valueChange.emit(null);
        return;
      } else if (pattern.test(value)) {
        const numberValue = Number(value);

        this.onChange?.(numberValue as T);
        this.valueChange.emit(numberValue as T);
      }
    } else {
      this.onChange?.(value as T);
      this.valueChange.emit(value as T);
    }

    this.inputRef().nativeElement.value = value;
  }
}
