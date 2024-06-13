import { Overlay } from '@angular/cdk/overlay';
import { DestroyRef, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, map } from 'rxjs';
import { I18N_NAMESPACE } from '../../internal/constants';
import { DLSDOverlayService } from '../../overlay/overlay-service/overlay.service';
import { DEFAULT_TOAST_COLORS } from '../constants';
import { DLSDToastColor, DLSDToastType } from '../enums';
import { DLSDToast } from '../interfaces';
import {
  DLSDToasterComponent,
  ONYX_TOASTER_CONFIG,
} from '../toaster/toaster.component';

type DLSDToastOverride = Partial<Omit<DLSDToast, 'color' | 'message'>>;

@Injectable({
  providedIn: 'root',
})
export class DLSDToastService extends DLSDOverlayService {
  private toasts = signal<DLSDToast[]>([]);

  private routeChange$ = this.router.events.pipe(
    takeUntilDestroyed(this.destroyRef),
    map(() => this.router.url.split('?')[0]),
    distinctUntilChanged(),
    map(() => undefined)
  );

  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private translateService: TranslateService,
    protected override overlay: Overlay
  ) {
    super(overlay);

    this.attachToastsOverlay();

    this.routeChange$.subscribe(() =>
      this.toasts.update((toasts) => toasts.filter((t) => t.keepOnNavigation))
    );
  }

  public showSuccess(message: string, override?: DLSDToastOverride): DLSDToast {
    return this.showToast({
      color: DLSDToastColor.GREEN,
      message,
      keepOnNavigation: override?.keepOnNavigation,
    });
  }

  public showError(message: string, override?: DLSDToastOverride): DLSDToast {
    return this.showToast({
      color: DLSDToastColor.RED,
      message,
      keepOnNavigation: override?.keepOnNavigation,
    });
  }

  public showInformation(
    message: string,
    override?: DLSDToastOverride
  ): DLSDToast {
    return this.showToast({
      color: DLSDToastColor.GRAY,
      message,
      keepOnNavigation: override?.keepOnNavigation,
    });
  }

  public showCustom(type: DLSDToastType): DLSDToast {
    const toast = this.mapType(type);
    return this.showToast(toast);
  }

  public hideToast(toast: DLSDToast): void {
    this.toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  private showToast(toast: DLSDToast): DLSDToast {
    this.toasts.update((toasts) => [toast, ...toasts]);
    return toast;
  }

  private mapType(type: DLSDToastType): DLSDToast {
    const color = DEFAULT_TOAST_COLORS[type];
    const message = this.translateService.instant(
      `${I18N_NAMESPACE}.toasts.${type}`
    );

    return {
      color,
      message,
    };
  }

  private attachToastsOverlay(): void {
    if (this.overlayRef()?.hasAttached()) return;

    if (!this.overlayRef()) {
      this.createAndSetOverlayRef({
        positionStrategy: this.overlay
          .position()
          .global()
          .bottom('16px')
          .left('16px'),
      });
    }

    this.attachToOverlay(
      this.createComponentPortal(
        DLSDToasterComponent,
        undefined,
        this.createComponentInjector(ONYX_TOASTER_CONFIG, {
          toasts: this.toasts.asReadonly(),
          hideToast: (toast) => this.hideToast(toast),
        })
      )
    );
  }
}
