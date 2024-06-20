import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  OnInit,
  ViewContainerRef,
  effect,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TooltipService } from '../../view/tooltip/tooltip-service/tooltip.service';

@Directive({
  selector: '[textsOverflow]',
  standalone: true,
})
export class DLSDTextsOverflowDirective implements OnInit {
  public textsOverflow = input.required<string[] | string>();
  public textsOverflowPlaceholder = input<string>();
  public textsOverflowElementRef = input<ElementRef>();

  private isOverflow = signal<boolean>(false);

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private tooltipService: TooltipService
  ) {}

  public ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const texts = this.textsOverflow();

          if (!texts.length) {
            this.elementRef.nativeElement.innerText =
              this.textsOverflowPlaceholder();
            this.isOverflow.set(false);
            return;
          }

          if (typeof texts === 'string') {
            this.compressString(texts);
          } else {
            this.compressArray(texts);
          }
        },
        { allowSignalWrites: true }
      );
    });
  }

  @HostListener('mouseenter')
  protected show(): void {
    if (!this.isOverflow()) return;

    const text = this.textsOverflow();
    this.tooltipService.attachTooltip(
      this.textsOverflowElementRef() ?? this.elementRef,
      this.viewContainerRef,
      typeof text === 'string' ? text : text.join('; ')
    );
  }

  private compressArray(texts: string[]): void {
    const element = this.elementRef.nativeElement;
    element.innerText = texts.join(', ');

    if (element.scrollWidth <= element.clientWidth) return;

    this.isOverflow.set(true);
    let counter = texts.length;

    while (element.scrollWidth > element.clientWidth && counter > 1) {
      element.innerText = texts
        .slice(0, --counter)
        .join(', ')
        .concat(`, +${texts.length - counter}`);
    }
  }

  private compressString(text: string): void {
    const element = this.elementRef.nativeElement;
    element.innerText = text;

    if (element.scrollWidth <= element.clientWidth) return;

    this.isOverflow.set(true);
    let counter = 0;

    while (element.scrollWidth > element.clientWidth) {
      element.innerText = '...'.concat(text.slice(++counter, text.length));
    }
  }
}
