import { OverlayRef } from '@angular/cdk/overlay';
import {
  ElementRef,
  Injectable,
  InjectionToken,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { DLSDCustomOverlayConfig } from '../../../overlay/interfaces';
import overlayPositions from '../../../overlay/overlay-positions';
import { DLSDOverlayService } from '../../../overlay/overlay-service/overlay.service';
import { DLSDDropdownOverlayConfig } from '../dropdown-interfaces';

@Injectable({
  providedIn: 'root',
})
export class DLSDDropdownService {
  private intersectionObserver?: IntersectionObserver;
  private subDropdowns: DLSDDropdownOverlayConfig[] = [];

  public get detach$() {
    return this.overlayService.detach$;
  }

  public get componentRef() {
    return this.overlayService.componentRef();
  }

  public get hasAttached() {
    return this.overlayService.overlayRef()?.hasAttached();
  }

  constructor(private overlayService: DLSDOverlayService) {}

  public attachDropdown<T extends DLSDCustomOverlayConfig, CT>(
    sourceRef: ElementRef,
    viewContainerRef: ViewContainerRef,
    component: Type<CT>,
    injectionToken: InjectionToken<T>,
    config: T
  ): void {
    this.detachDropdown();
    this.createOverlayWithPositions(sourceRef, config);
    this.createDropdownAndAttachToOverlay(
      viewContainerRef,
      component,
      injectionToken,
      config
    );
    this.createIntersectionObserverAndObserve(sourceRef);
    this.subscribeOutsideClickEvent(sourceRef, () => this.detachDropdown());
  }

  public detachDropdown(): void {
    const sourceRef = this.overlayService.sourceRef();
    if (sourceRef) {
      this.intersectionObserver?.unobserve(sourceRef.nativeElement);
    }

    this.overlayService.detachFromOverlay();
    // let overlayRefs = this.overlayRefs.pop();
    // while (overlayRefs) {
    //   overlayRefs.detach();
    //   overlayRefs = this.overlayRefs.pop();
    // }
  }

  public attachSubDropdown<T extends DLSDCustomOverlayConfig, CT>(
    sourceRef: ElementRef,
    viewContainerRef: ViewContainerRef,
    component: Type<CT>,
    injectionToken: InjectionToken<T>,
    config: T
  ): void {
    this.detachSubDropdown();

    const positionStrategy = this.overlayService.defaultPositionStrategy(
      sourceRef.nativeElement,
      [
        overlayPositions.positionStrategyRight(),
        overlayPositions.positionStrategyLeft(),
      ]
    );
    const overlayRef = this.overlayService.createOverlayRef({
      positionStrategy,
      scrollStrategy: this.overlayService.scrollStrategies.reposition(),
    });
    const dropdownInjector = this.overlayService.createComponentInjector(
      injectionToken,
      config
    );
    const dropdownPortal = this.overlayService.createComponentPortal(
      component,
      viewContainerRef,
      dropdownInjector
    );
    overlayRef.attach(dropdownPortal);

    this.subscribeOutsideClickEvent(sourceRef, () => this.detachSubDropdown());
    const intersectionObserver = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        overlayRef.removePanelClass('hidden');
      } else {
        overlayRef.addPanelClass('hidden');
      }
    });
    intersectionObserver.observe(sourceRef.nativeElement);

    this.subDropdowns.push({
      overlayRef,
      intersectionObserver,
    });
  }

  public detachSubDropdown(): void {
    const subDropdown = this.subDropdowns.pop();
    if (!subDropdown?.overlayRef.hasAttached()) return;

    subDropdown.overlayRef.detach();
    subDropdown.intersectionObserver?.disconnect();
  }

  private createOverlayWithPositions(
    sourceRef: ElementRef,
    config: DLSDCustomOverlayConfig
  ): void {
    const positionStrategy = this.overlayService.defaultPositionStrategy(
      config.targetRef ?? sourceRef.nativeElement,
      [
        overlayPositions.positionStrategyTop(),
        overlayPositions.positionStrategyBottom(),
        overlayPositions.positionStrategyRight(),
        overlayPositions.positionStrategyLeft(),
      ]
    );
    this.overlayService.createAndSetOverlayRef(
      {
        positionStrategy,
        scrollStrategy: this.overlayService.scrollStrategies.reposition(),
        hasBackdrop: config.hasBackdrop,
        backdropClass: 'dropdown-backdrop',
      },
      sourceRef
    );
  }

  private createDropdownAndAttachToOverlay<T>(
    viewContainerRef: ViewContainerRef,
    component: Type<unknown>,
    injectionToken: InjectionToken<T>,
    config: T
  ): void {
    const dropdownInjector = this.overlayService.createComponentInjector(
      injectionToken,
      config
    );
    const dropdownPortal = this.overlayService.createComponentPortal(
      component,
      viewContainerRef,
      dropdownInjector
    );
    this.overlayService.attachToOverlay(dropdownPortal);
  }

  private createIntersectionObserverAndObserve(
    elementRef: ElementRef,
    overlayRefs: OverlayRef[] = []
  ): void {
    if (!this.intersectionObserver) {
      this.intersectionObserver = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) {
          this.overlayService.removePanelClass('hidden');
          // overlayRefs.forEach((overlayRef) =>
          //   overlayRef.removePanelClass('hidden')
          // );
        } else {
          this.overlayService.addPanelClass('hidden');
          // overlayRefs.forEach((overlayRef) =>
          //   overlayRef.addPanelClass('hidden')
          // );
        }
      });
    }
    this.intersectionObserver.observe(elementRef.nativeElement);
  }

  private subscribeOutsideClickEvent(
    sourceRef: ElementRef,
    callback: () => void
  ): void {
    this.overlayService
      .overlayRef()
      ?.outsidePointerEvents()
      .pipe(takeUntil(this.overlayService.detach$))
      .subscribe((event: MouseEvent) => {
        if (sourceRef.nativeElement.contains(event.target)) return;
        callback();
      });
  }
}
