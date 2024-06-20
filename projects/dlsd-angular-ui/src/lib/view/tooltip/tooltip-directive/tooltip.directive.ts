import {
  Directive,
  ElementRef,
  HostListener,
  ViewContainerRef,
  input,
} from '@angular/core';
import { OverlayPosition } from '../../../overlay/overlay-positions';
import { TooltipService } from '../tooltip-service/tooltip.service';
import { TooltipContext } from '../tooltip-template/tooltip-template.component';

@Directive({
  selector: '[dlsdTooltip]',
  standalone: true,
})
export class TooltipDirective {
  public tooltipContext = input.required<TooltipContext | undefined>({
    alias: 'dlsdTooltip',
  });
  public tooltipArrowOffsets = input<{
    x?: number;
    y?: number;
    calculateY?: boolean;
    calculateX?: boolean;
  }>({});
  public tooltipPositions = input<OverlayPosition[]>([]);
  public tooltipTargetRef = input<HTMLElement>();
  public tooltipDelay = input<number>(0);
  public tooltipDisableFn = input<() => boolean>();

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private tooltipService: TooltipService
  ) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  public show(): void {
    const tooltipContext = this.tooltipContext();
    if (!tooltipContext || !!this.tooltipDisableFn()?.()) {
      return;
    }

    this.tooltipService.attachTooltip(
      this.elementRef,
      this.viewContainerRef,
      tooltipContext,
      this.tooltipArrowOffsets(),
      this.tooltipDelay()
    );
  }

  @HostListener('keydown.shift.tab')
  @HostListener('keydown.tab')
  public close(): void {
    this.tooltipService.detachTooltip();
  }
}
