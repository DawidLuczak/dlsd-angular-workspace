import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  CdkListboxModule,
  CdkOption,
  ListboxValueChangeEvent,
} from '@angular/cdk/listbox';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  OnInit,
  computed,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HighlightPipe } from '../../pipes/highlight/highlight.pipe';
import {
  DropdownConfig,
  DropdownOption,
  DropdownOptionsGroup,
  DropdownSourceOptions,
} from '../dropdown-interfaces';

export const DROPDOWN_CONFIG = new InjectionToken<DropdownConfig<any>>(
  'Options to display in a dropdown'
);

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [
    CdkListboxModule,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    NgClass,
    NgTemplateOutlet,
    HighlightPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent<T> implements OnInit, AfterViewInit {
  @HostBinding('style.width.px') public width?: number;

  protected options = signal<DropdownOptionsGroup<T>[] | null | undefined>([]);
  protected value = signal<DropdownOption<T>[]>([]);
  protected query = signal<string | undefined>(undefined);
  protected selectedAll = signal<boolean>(false);
  protected optionDragIndicator = signal<number | null>(null);
  protected optionsSortedDisabledFirst = computed(() =>
    this.options()?.map((optionsGroup) => ({
      options: optionsGroup.options.reduce(
        (previous, current) => {
          if (current.disabled) {
            previous.disabled.push(current);
          } else {
            previous.enabled.push(current);
          }
          return previous;
        },
        {
          disabled: [] as DropdownOption<T>[],
          enabled: [] as DropdownOption<T>[],
        }
      ),
      headerTemplateRef: optionsGroup.headerTemplateRef,
    }))
  );

  protected optionRefs = viewChildren<CdkOption<DropdownOption<T>>>(CdkOption);
  private focusedOptionIndex = signal<number | undefined>(undefined);

  constructor(
    @Inject(DROPDOWN_CONFIG) protected config: DropdownConfig<T>,
    private destroyRef: DestroyRef
  ) {
    this.width = config.width;
  }

  public ngOnInit(): void {
    this.setOptions();
  }

  public ngAfterViewInit(): void {
    this.focusFirstOption();
  }

  public focusOption(index: 0 | -1): void {
    const optionRefs = this.optionRefs();
    if (!optionRefs.length) return;

    const focusIndex = index === 0 ? 0 : optionRefs.length - 1;
    optionRefs[focusIndex].element.focus();
    this.focusedOptionIndex.set(focusIndex);
  }

  @HostListener('keydown.backspace')
  protected clearSelectedValues(): void {
    this.config.clearValue?.();
  }

  @HostListener('keydown.tab')
  @HostListener('keydown.shift.tab')
  protected focusoutCloseDropdown(): void {
    this.config.close();
  }

  @HostListener('keydown.arrowup')
  @HostListener('keydown.arrowdown')
  protected focusInputWithArrows(): void {
    const index = this.optionRefs().findIndex((option) => option.isActive());

    if (index === this.focusedOptionIndex()) {
      if (!this.config.search) {
        this.focusOption(index === 0 ? -1 : 0);
      }
    } else {
      this.focusedOptionIndex.set(index);
    }
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  protected keyboardUnselectOption(): void {
    this.unselectOption(this.optionRefs()[this.focusedOptionIndex()!].value);
  }

  protected changeOptions(
    listboxEventValue: ListboxValueChangeEvent<DropdownOption<T>>
  ): void {
    if (!listboxEventValue.option?.value) {
      if (listboxEventValue.option?.value === null) {
        this.selectAll(!this.selectedAll());
      }
      return;
    }

    setTimeout(() => {
      const options = this.options()!;
      const flattenOptions = this.reduceOptionsGroup(options);
      this.value.set([...listboxEventValue.value]);
      this.config.onValueChange(
        listboxEventValue.option!.value,
        flattenOptions
      );
      this.selectedAll.set(this.isAllSelected(flattenOptions));
    });
  }

  protected unselectOption(option: DropdownOption<T>): void {
    if (!(this.config.optional && !this.config.multiple && option.selected)) {
      return;
    }

    option.selected = false;
    this.value.set([option]);
    const flattenOptions = this.reduceOptionsGroup(this.options()! ?? []);
    this.config.onValueChange(option, flattenOptions);
  }

  protected dropDragOption(
    event: CdkDragDrop<{ title: string; poster: string }[]>,
    optionsGroup: {
      disabled: DropdownOption<T>[];
      enabled: DropdownOption<T>[];
    },
    optionIndex: number
  ): void {
    const optionDragIndicator = this.optionDragIndicator();
    const currentIndex =
      optionDragIndicator != null
        ? optionDragIndicator > optionIndex
          ? optionDragIndicator - 1
          : optionDragIndicator
        : event.previousIndex;
    moveItemInArray(optionsGroup.enabled, event.previousIndex, currentIndex);
    const disabledOptionsOffset = optionsGroup.disabled.length;
    this.config.onOptionDrag?.({
      ...event,
      previousIndex: event.previousIndex + disabledOptionsOffset,
      currentIndex: currentIndex + disabledOptionsOffset,
    });
    this.optionDragIndicator.set(null);
  }

  protected moveDragOption(event: CdkDragMove, index: number): void {
    const optionElements =
      event.source.dropContainer.element.nativeElement.children;
    const offsetY =
      (optionElements.item(index) as HTMLElement).offsetTop + event.distance.y;
    let i = 0;
    while (
      i < optionElements.length &&
      (optionElements.item(i) as HTMLElement).offsetTop + 16 < offsetY
    ) {
      i++;
    }
    this.optionDragIndicator.set(i);
  }

  private isAllSelected(options: DropdownOption<T>[] | undefined): boolean {
    if (!options) return false;

    return !options.some((option) => !option.selected);
  }

  private selectAll(isAllSelected: boolean): void {
    const options = this.options()!;
    const flattenedOptions = this.reduceOptionsGroup(options);
    const disabledOptions: DropdownOption<T>[] = flattenedOptions.filter(
      (option) => option.disabled
    );

    this.options.set([
      {
        options: flattenedOptions,
      },
    ]);
    this.config.onValueChange(
      { name: 'selectAll', value: isAllSelected as T },
      flattenedOptions
    );
    this.selectedAll.set(isAllSelected);
    this.value.set(isAllSelected ? flattenedOptions : disabledOptions);
  }

  private setOptions(): void {
    if (this.config.options instanceof Observable) {
      this.config.options
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((options) => this.setOptionsFromSource(options));
    } else {
      this.options.set(this.config.options);
      if (!this.config.options) return;

      const flattenOptions = this.reduceOptionsGroup(this.config.options);
      this.value.set(flattenOptions.filter((option) => option.selected) ?? []);
      this.selectedAll.set(this.isAllSelected(flattenOptions));
      this.focusFirstOption();
    }
  }

  private setOptionsFromSource(options: DropdownSourceOptions<T>): void {
    if (options.options?.length) {
      this.options.set(
        this.config.multiple
          ? this.sortOptions(options.options)
          : options.options
      );
      const flattenOptions = this.reduceOptionsGroup(options.options);
      this.selectedAll.set(this.isAllSelected(flattenOptions));
      this.value.set(flattenOptions.filter((option) => option.selected));
    } else {
      this.options.set(options.options);
      this.value.set([]);
    }
    this.query.set(options.query);
    this.focusFirstOption();
  }

  private sortOptions(
    optionsGroups: DropdownOptionsGroup<T>[]
  ): DropdownOptionsGroup<T>[] {
    return optionsGroups.map((optionsGroup) => {
      const options = optionsGroup.options.reduce(
        (previous, current) => {
          if (current.selected) {
            previous.selected.push(current);
          } else {
            previous.other.push(current);
          }
          return previous;
        },
        {
          selected: [] as DropdownOption<T>[],
          other: [] as DropdownOption<T>[],
        }
      );
      return {
        options: [...options.selected, ...options.other],
        headerTemplateRef: optionsGroup.headerTemplateRef,
      };
    });
  }

  private focusFirstOption(): void {
    if (this.config.search !== false || !this.options()?.length) {
      return;
    }

    setTimeout(() => this.optionRefs()[0]?.element.focus());
  }

  private reduceOptionsGroup(
    arrayGroups: DropdownOptionsGroup<T>[]
  ): DropdownOption<T>[] {
    return arrayGroups.reduce(
      (previous, current) => previous.concat(current.options),
      [] as DropdownOption<T>[]
    );
  }
}
