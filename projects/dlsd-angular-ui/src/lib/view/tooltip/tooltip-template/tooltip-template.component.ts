import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  InjectionToken,
  TemplateRef,
  computed,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';

export type TooltipContext = string | TemplateRef<unknown>;
export interface TooltipConfig {
  readonly position$: Observable<{ arrowX: number; arrowY: number }>;
  context: TooltipContext;
  close: () => void;
}

export const TOOLTIP_CONFIG = new InjectionToken<TooltipConfig>(
  'Data to display in a tooltip'
);

@Component({
  selector: 'dlsd-tooltip',
  standalone: true,
  imports: [AsyncPipe, NgTemplateOutlet],
  templateUrl: './tooltip-template.component.html',
  styleUrls: ['./tooltip-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipTemplateComponent {
  protected contextAsString = computed(() => {
    const context = this.context();
    return typeof context === 'string' ? context : false;
  });
  protected contextAsTemplate = computed(() => {
    const context = this.context();
    return context instanceof TemplateRef ? context : false;
  });

  private context = signal<TooltipContext | undefined>(undefined);

  constructor(@Inject(TOOLTIP_CONFIG) public readonly config: TooltipConfig) {
    this.context.set(this.config.context);
  }

  @HostListener('mouseleave')
  public close(): void {
    this.config.close();
  }
}
