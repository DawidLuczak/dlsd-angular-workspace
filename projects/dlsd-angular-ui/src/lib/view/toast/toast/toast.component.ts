import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { DLSDToastColor } from '../enums';
import { DLSDToastCloseButtonComponent } from './toast-close-button/toast-close-button.component';

@Component({
  selector: 'dlsd-toast',
  standalone: true,
  imports: [DLSDToastCloseButtonComponent, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDToastComponent implements OnInit, OnDestroy {
  private readonly ANIMATION_DURATION = 300;
  private readonly TOAST_DURATION = 10_000;

  public color = input.required<DLSDToastColor>();
  public message = input.required<string>();
  public forceClose = input<boolean>(false);

  public closeToast = output<void>();

  protected fadeOutAnimation = signal<boolean>(false);

  private toastRef = viewChild.required<ElementRef<HTMLElement>>('toastRef');
  private clear$ = new Subject<void>();

  constructor() {
    effect(
      () => {
        if (this.forceClose()) this.close();
      },
      { allowSignalWrites: true }
    );
  }

  public ngOnInit(): void {
    this.startTimer();
  }

  public ngOnDestroy(): void {
    this.clear$.next();
    this.clear$.complete();
  }

  protected startTimer(): void {
    this.clearTimer();

    timer(this.TOAST_DURATION)
      .pipe(takeUntil(this.clear$))
      .subscribe(() => this.close());
  }

  protected clearTimer(): void {
    this.clear$.next();
  }

  protected close(): void {
    this.clearTimer();

    this.updateAnimationHeight();
    this.fadeOutAnimation.set(true);

    timer(this.ANIMATION_DURATION).subscribe(() => this.closeToast.emit());
  }

  private updateAnimationHeight(): void {
    const toastElement = this.toastRef().nativeElement;
    const height = toastElement.offsetHeight;
    toastElement.style.setProperty('--height', `${height}px`);
  }
}
