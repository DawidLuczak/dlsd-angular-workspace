import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgLetModule } from 'ng-let';
import { DLSDNumberLabelComponent } from '../../labels/number-label/number-label.component';
import { DLSDTabsType } from '../enums';
import { DLSDTab } from '../interfaces';

@Component({
  selector: 'dlsd-tabs',
  standalone: true,
  imports: [DLSDNumberLabelComponent, NgClass, NgLetModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DLSDTabsComponent),
      multi: true,
    },
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDTabsComponent<T>
  implements ControlValueAccessor, AfterViewInit
{
  protected readonly TabsType = DLSDTabsType;

  public tabs = input.required<DLSDTab<T>[]>();
  public type = input<DLSDTabsType>(DLSDTabsType.TABS);
  public size = input<'s' | 'm'>('s');
  public value = model<DLSDTab<T>>();

  protected onChange?: (value: DLSDTab<T>) => void;
  protected onTouched?: () => void;
  protected activeTabIndex = signal<number>(0);

  private containerRef = viewChild.required<ElementRef>('containerRef');
  private tabRefs = viewChildren<ElementRef>('tabRef');
  private indicatorRef = viewChild.required<ElementRef>('indicatorRef');

  public ngAfterViewInit(): void {
    this.updateIndicator();
  }

  public writeValue(value: T): void {
    let tabIndex = this.tabs().findIndex((tab) => tab.value === value);
    if (tabIndex === -1) tabIndex = 0;

    this.activeTabIndex.set(tabIndex);
    this.value.set(this.tabs()[tabIndex]);
  }

  public registerOnChange(fn: (value: DLSDTab<T>) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected changeActiveTab(index: number): void {
    const tab = this.tabs()[index];
    if (tab.disabled) return;

    this.activeTabIndex.set(index);
    this.value.set(tab);
    this.onChange?.(tab);
    this.updateIndicator();
  }

  private updateIndicator(animate = true): void {
    const element = this.containerRef().nativeElement;
    if (!element) return;

    const tab = this.tabRefs()[this.activeTabIndex()].nativeElement;
    const indicator = this.indicatorRef().nativeElement;

    if (!animate) {
      indicator.style.transitionDuration = '0s';
      setTimeout(() => (indicator.style.transitionDuration = '300ms'));
    }

    indicator.style.width = `${tab.clientWidth}px`;
    indicator.style.transform = `translateX(${
      tab.offsetLeft - element.clientLeft
    }px)`;

    if (!indicator.style.transitionDuration) {
      setTimeout(() => (indicator.style.transitionDuration = '300ms'));
    }

    if (
      tab.offsetLeft < element.scrollLeft ||
      tab.offsetLeft + tab.clientWidth > element.offsetWidth
    ) {
      element.scroll({ left: tab.offsetLeft, behavior: 'smooth' });
    }
  }
}
