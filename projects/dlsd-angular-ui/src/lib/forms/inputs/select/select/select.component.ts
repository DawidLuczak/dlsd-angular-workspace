import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  computed,
  effect,
  forwardRef,
  input,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep, isArray } from 'lodash';
import { NgLetModule } from 'ng-let';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  map,
  switchMap,
} from 'rxjs';
import { DLSDClearButtonComponent } from '../../../../buttons';
import { DLSDTextsOverflowDirective } from '../../../../directives';
import { I18N_NAMESPACE } from '../../../../internal/constants';
import { caretSelectionPosition } from '../../../../internal/utilities/selection-position';
import {
  DLSDDropdownDirective,
  DLSDDropdownOption,
  DLSDDropdownOptionsGroup,
} from '../../../../view/dropdown';
import { TooltipDirective } from '../../../../view/tooltip';
import { DLSDFormControlErrorComponent } from '../../../controls';
import { DLSDBaseFormControlComponent } from '../../../controls/base-form-control/base-form-control.component';
import { DLSDInputLabelComponent } from '../../../labels';

@Component({
  selector: 'dlsd-select',
  standalone: true,
  imports: [
    DLSDInputLabelComponent,
    DLSDDropdownDirective,
    DLSDClearButtonComponent,
    DLSDFormControlErrorComponent,
    DLSDTextsOverflowDirective,
    TooltipDirective,
    NgClass,
    NgTemplateOutlet,
    NgLetModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDSelectComponent<T>
  extends DLSDBaseFormControlComponent
  implements ControlValueAccessor, OnInit
{
  protected readonly I18N = `${I18N_NAMESPACE}.select`;

  @HostBinding('style.width') @Input() public width = '100%';

  public source =
    input<(query: string) => Observable<DLSDDropdownOption<T>[] | null>>();
  public options = input<
    DLSDDropdownOption<T>[] | null,
    DLSDDropdownOption<T>[] | null
  >(null, {
    transform: (options: DLSDDropdownOption<T>[] | null) => cloneDeep(options),
  });
  public optionTemplateRef = input<TemplateRef<any>>();
  public label = input<string>();
  public hint = input<string>();
  public placeholder = input<string>();
  public tooltip = input<string | undefined>();
  public addOption = input<boolean>(false);
  public multiple = input<boolean>(false);
  public search = input<boolean>(false);
  public optional = input<boolean>(true);
  public showErrors = input<boolean>(true);
  public size = input<'s' | 'm'>('m');

  public handleAddOption = output();

  protected selectRef = viewChild.required<ElementRef>('selectElementRef');
  protected onChange?: (value: T | T[] | null) => void;
  protected onTouched?: () => void;
  protected disabled = signal(false);
  protected expanded = signal<boolean>(false);
  protected query = signal<string>('');
  protected value = signal<DLSDDropdownOption<T>[]>([]);
  protected valueNames = computed(() =>
    this.value().map((value) => value.name)
  );

  private _options$ = new BehaviorSubject<{
    options: DLSDDropdownOptionsGroup<T>[] | null;
    query: string;
  }>({ options: null, query: '' });
  protected get options$() {
    return this._options$.asObservable();
  }

  private formControlValue = signal<T[]>([]);
  private request$ = new Subject<{
    source: (query: string) => Observable<DLSDDropdownOption<T>[] | null>;
    query: string;
  }>();

  constructor(
    protected override injector: Injector,
    private destroyRef: DestroyRef
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        switchMap(({ source, query }) =>
          source(query).pipe(
            map((options) => {
              const optionsClone = options ? cloneDeep(options) : [];
              this.selectOptionsWithValue(optionsClone);
              this._options$.next({
                options: [{ options: optionsClone }],
                query,
              });
            })
          )
        )
      )
      .subscribe();

    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const options = this.options();
          const source = this.source();
          const query = this.query();

          if (options) {
            this._options$.next({
              options: [{ options: this.searchOptions(options, query) }],
              query,
            });
          } else if (source) {
            this._options$.next({ options: null, query });
            this.request$.next({ source, query });
          }
        },
        {
          allowSignalWrites: true,
        }
      );
    });
  }

  public writeValue(value: T | T[] | null): void {
    if (!value) {
      this.value.set([]);
      return;
    }

    const options = this.options();
    if (!options) {
      this.formControlValue.set(isArray(value) ? value : [value]);
      return;
    }

    if (isArray(value)) {
      const values = value
        .map((v) => options.find((option) => option.value === v))
        .filter((option): option is DLSDDropdownOption<T> => !!option)
        .map((option) => {
          option.selected = true;
          return option;
        }) as DLSDDropdownOption<T>[];
      this.changeValue(values);
    } else {
      const option = options.find((option) => option.value === value);

      if (option) {
        option.selected = true;
        this.changeValue([option]);
      } else {
        this.value.set([]);
      }
    }
  }

  public registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  public focus(): void {
    this.selectRef().nativeElement.focus();
  }

  protected backspaceInput(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.query().length) return;

    const selection = document.getSelection()!;
    const selectionRange = selection.getRangeAt(0);
    const caretPosition = selectionRange.startOffset;
    const isSelectedRange =
      selectionRange.endOffset === selectionRange.startOffset;
    if (caretPosition === 0 && isSelectedRange) {
      return;
    }

    this.query.update((value) => {
      const newQuery = value.slice(
        0,
        isSelectedRange
          ? selectionRange.startOffset - 1
          : selectionRange.startOffset
      );
      if (value.length <= selectionRange.endOffset) return newQuery;

      return newQuery.concat(
        value.slice(selectionRange.endOffset, value.length)
      );
    });

    setTimeout(() => {
      const caret = caretSelectionPosition(
        selection.anchorNode!,
        isSelectedRange ? caretPosition - 1 : caretPosition
      );
      caret.collapseToEnd();
    });
  }

  protected changeInput(value: Event): void {
    const inputValue = value as InputEvent;
    if (!inputValue.data) return;

    this.query.update((query) => query.concat(inputValue.data!));
    this.moveCaretToTheEnd();
  }

  protected clearValue(): void {
    if (this.options()) {
      this.options()?.forEach((option) => (option.selected = false));
    } else if (this.source()) {
      const value = this._options$.value;
      value.options?.forEach((optionGroup) =>
        optionGroup.options.forEach(
          (option: DLSDDropdownOption<T>) => (option.selected = false)
        )
      );
    }
    this.changeValue([]);
    this.query.update(() => '');
  }

  protected clearValueUsingKeyboard(event: Event): void {
    if (!this.optional() || (!this.query() && !this.value())) return;

    event.preventDefault();
    this.clearValue();
  }

  protected openSelect(): void {
    if (this.disabled()) return;

    this.selectRef().nativeElement.click();
  }

  protected selectAll(options: DLSDDropdownOption<T>[]): void {
    const value = options.length === this.value().length;
    options.forEach((o) => (o.selected = value));
    this.changeValue(options);
  }

  protected selectValueChange(event: {
    value: DLSDDropdownOption<T>;
    options: DLSDDropdownOption<T>[];
  }): void {
    if (this.multiple()) {
      this.selectMultipleOption(event.value, event.options);
    } else {
      this.selectSingleOption(event.value);
    }
  }

  protected toggleDropdown(isExpanding: boolean): void {
    this.expanded.set(isExpanding);
    if (!isExpanding) return;

    setTimeout(() => {
      this.selectRef().nativeElement.childNodes[0].focus();
    });
  }

  protected focusSearchInput = (): void => {
    if (!this.search() && !this.addOption()) return;

    setTimeout(() => {
      this.selectRef().nativeElement.children[0].focus();
      if (!this.query().length) return;
    });
  };

  protected disableArrowMovesCursor(event: Event): void {
    if (this.query()) return;

    event.preventDefault();
  }

  private changeValue(value: DLSDDropdownOption<T>[]): void {
    this.value.set(value);
    this.formControlValue.set(value.map((v) => v.value));
    this.onChange?.(
      this.multiple() ? value.map((v) => v.value) : value[0]?.value ?? null
    );
    this.onTouched?.();
  }

  private selectSingleOption(option: DLSDDropdownOption<T>): void {
    const value = this.value();
    if (!this.optional() && option.selected) return;

    option.selected = true;
    if (value.length) value[0].selected = false;
    this.changeValue(option.selected ? [option] : []);
  }

  private selectMultipleOption(
    value: DLSDDropdownOption<T>,
    options: DLSDDropdownOption<T>[]
  ): void {
    value.selected = !value.selected;
    const selectedOptions = options.filter((option) => option.selected);
    this.changeValue(selectedOptions);
  }

  private searchOptions(
    options: DLSDDropdownOption<T>[],
    query: string
  ): DLSDDropdownOption<T>[] {
    if (!query) return options;

    const queryLowercase = query.toLowerCase();
    return options.filter((option) =>
      option.name.toLowerCase().includes(queryLowercase)
    );
  }

  private selectOptionsWithValue(options: DLSDDropdownOption<T>[]): void {
    if (this.value().length) {
      this.value().forEach((value) => {
        const option = options.find((option) => option.value === value.value);
        if (option) option.selected = true;
      });
    } else {
      this.formControlValue().forEach((value) => {
        const option = options.find((option) => option.value === value);
        if (option) option.selected = true;
      });
      this.value.set(options.filter((option) => option.selected));
    }
  }

  private moveCaretToTheEnd(): void {
    document.execCommand('selectAll', false);
    document.getSelection()?.collapseToEnd();
  }
}
