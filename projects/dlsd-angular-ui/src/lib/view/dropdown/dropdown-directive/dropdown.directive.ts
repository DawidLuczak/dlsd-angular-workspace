import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  input,
  model,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  race,
  take,
} from 'rxjs';
import { OverlayPosition } from '../../../overlay/overlay-positions';
import {
  DLSDDropdownConfig,
  DLSDDropdownOption,
  DLSDDropdownOptions,
} from '../dropdown-interfaces';
import { DLSDDropdownService } from '../dropdown-service/dropdown.service';
import {
  DROPDOWN_CONFIG,
  DropdownComponent,
} from '../dropdown/dropdown.component';

@Directive({
  selector: '[dlsdDropdownOptions]',
  standalone: true,
})
export class DLSDDropdownDirective<T> implements OnInit {
  public dropdownOptions = input.required<DLSDDropdownOptions<T>>({
    alias: 'dlsdDropdownOptions',
  });
  public dropdownOptionTemplateRef = input<TemplateRef<unknown>>();
  public dropdownDisabled = input<boolean>();
  public dropdownHostCss = input<DLSDDropdownConfig<T>['hostCss']>(['fill']);
  public dropdownMultiple = input<boolean>();
  public dropdownInheritWidth = input<boolean>();
  public dropdownNoResultsMessage = input<string>();
  public dropdownSearch = input<boolean>();
  public dropdownOptional = input<boolean>();
  public dropdownFocusElement = input<() => void>();
  public dropdownPositions = input<OverlayPosition[]>();
  public dropdownOverridePositions = input<Partial<ConnectedPosition>>();
  public dropdownTargetRef = input<HTMLElement>();
  public dropdownTitle = input<string>();
  public dropdownOptionsDraggable = input<boolean>();
  public dropdownHasBackdrop = input<boolean>();
  public dropdownAttachElementRef = input<boolean>(false);
  public dropdownAttached = model<boolean>(false);

  public dropdownValueChange = output<{
    value: DLSDDropdownOption<T>;
    options: DLSDDropdownOption<T>[];
  }>();
  public dropdownOptionAdd = output();
  public dropdownClearValue = output();
  public dropdownOptionDrag =
    output<CdkDragDrop<{ title: string; poster: string }[]>>();

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private dropdownService: DLSDDropdownService,
    private destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    race(
      fromEvent(this.elementRef.nativeElement, 'focus'),
      fromEvent(this.elementRef.nativeElement, 'click')
    )
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        if (!!this.dropdownDisabled() || !this.dropdownOptions()) {
          return;
        }
        if (!!this.dropdownAttached()) {
          this.detachDropdown();
          return;
        }

        this.attachDropdown();
      });
  }

  @HostListener('keydown.space', ['$event'])
  protected openDropdown(event?: Event): void {
    event?.stopPropagation();
    if (!!this.dropdownDisabled() || !this.dropdownOptions()) {
      return;
    }
    if (!!this.dropdownAttached()) {
      this.detachDropdown();
      return;
    }
    event?.preventDefault();

    this.attachDropdown();
  }

  @HostListener('keydown.tab')
  @HostListener('keydown.shift.tab')
  protected closeOnFocusout(): void {
    if (!this.dropdownAttached()) return;

    this.detachDropdown();
  }

  @HostListener('keydown.arrowup', ['$event'])
  protected focusDropdownFirstOption(event: Event): void {
    if (!this.dropdownAttached()) return;

    event.preventDefault();
    this.focusDropdownOption(-1);
  }

  @HostListener('keydown.arrowdown', ['$event'])
  protected focusDropdownLastOption(event: Event): void {
    if (!this.dropdownAttached()) return;

    event.preventDefault();
    this.focusDropdownOption(0);
  }

  private attachDropdown(): void {
    this.dropdownAttached.set(true);
    (this.elementRef.nativeElement as HTMLElement).classList.add('active');
    this.dropdownService.attachDropdown(
      this.elementRef,
      this.viewContainerRef,
      DropdownComponent,
      DROPDOWN_CONFIG,
      {
        attachElementRef: this.dropdownAttachElementRef(),
        clearValue: () => this.dropdownClearValue.emit(),
        close: () => {
          if (this.dropdownAttached()) this.detachDropdown();
        },
        hasBackdrop: this.dropdownHasBackdrop(),
        hostCss: this.dropdownHostCss(),
        multiple: this.dropdownMultiple(),
        noResultsMessage: this.dropdownNoResultsMessage(),
        optional: this.dropdownOptional(),
        options: this.dropdownOptions()!,
        optionsDraggable: this.dropdownOptionsDraggable(),
        optionTemplateRef: this.dropdownOptionTemplateRef(),
        onOptionDrag: (
          event: CdkDragDrop<{ title: string; poster: string }[]>
        ) => this.dropdownOptionDrag.emit(event),
        onValueChange: (
          value: DLSDDropdownOption<T>,
          options: DLSDDropdownOption<T>[]
        ) => {
          this.dropdownValueChange.emit({ value, options });
          if (!!this.dropdownMultiple() || value.options?.length) {
            return;
          }

          setTimeout(() => this.detachDropdown());
        },
        overridePositions: this.dropdownOverridePositions(),
        positions: this.dropdownPositions(),
        search: this.dropdownSearch(),
        targetRef: this.dropdownTargetRef(),
        title: this.dropdownTitle(),
        width: this.dropdownInheritWidth()
          ? this.elementRef.nativeElement.getBoundingClientRect().width
          : undefined,
      }
    );
    this.subscribeDetachment();
  }

  private detachDropdown(): void {
    this.focusSourceElement();
    this.dropdownService.detachDropdown();
  }

  private subscribeDetachment(): void {
    this.dropdownService.detach$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        (this.elementRef.nativeElement as HTMLElement).classList.remove(
          'active'
        );
        this.dropdownAttached.set(false);
      });
  }

  private focusSourceElement(): void {
    if (this.dropdownFocusElement()) {
      this.dropdownFocusElement()!();
    } else {
      this.elementRef.nativeElement.focus();
    }
  }

  private focusDropdownOption(index: 0 | -1): void {
    (
      this.dropdownService.componentRef?.instance as DropdownComponent<T>
    ).focusOption(index);
  }
}
