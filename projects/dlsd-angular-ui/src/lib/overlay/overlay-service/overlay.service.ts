import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  InjectionToken,
  Injector,
  Type,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DLSDOverlayService {
  private _overlayRef = signal<OverlayRef | undefined>(undefined);
  public get overlayRef() {
    return this._overlayRef.asReadonly();
  }

  private _componentRef = signal<ComponentRef<unknown> | undefined>(undefined);
  public get componentRef() {
    return this._componentRef.asReadonly();
  }

  private _sourceRef = signal<ElementRef | undefined>(undefined);
  public get sourceRef() {
    return this._sourceRef.asReadonly();
  }

  private _detach$ = new Subject<void>();
  public get detach$() {
    return this._detach$.asObservable();
  }

  public get scrollStrategies() {
    return this.overlay.scrollStrategies;
  }

  public get position() {
    return this.overlay.position();
  }

  constructor(protected overlay: Overlay) {}

  public attachToOverlay<T>(componentPortal: ComponentPortal<T>): void {
    const overlayRef = this.overlayRef();
    if (!overlayRef || overlayRef.hasAttached()) return;

    const componentRef = overlayRef.attach(componentPortal);
    this._componentRef.set(componentRef);
  }

  public createComponentInjector<T>(
    token: InjectionToken<T>,
    useValue: Partial<T>
  ): Injector {
    return Injector.create({
      providers: [
        {
          provide: token,
          useValue,
        },
      ],
    });
  }

  public createComponentPortal<T>(
    component: Type<T>,
    viewContainerRef?: ViewContainerRef,
    injector?: Injector,
    projectableNodes?: Node[][]
  ): ComponentPortal<T> {
    return new ComponentPortal<T>(
      component,
      viewContainerRef,
      injector,
      undefined,
      projectableNodes
    );
  }

  public createOverlayRef(overlayConfig?: OverlayConfig): OverlayRef {
    return this.overlay.create(overlayConfig);
  }

  public createAndSetOverlayRef(
    overlayConfig?: OverlayConfig,
    sourceRef?: ElementRef
  ): void {
    this._overlayRef.set(this.createOverlayRef(overlayConfig));
    this._sourceRef.set(sourceRef);
  }

  public detachFromOverlay(): void {
    this._detach$.next();
    this._overlayRef()?.detach();
    this._componentRef()?.destroy();
    this._componentRef.set(undefined);
  }

  public defaultPositionStrategy(
    elementRef: HTMLElement,
    positions: ConnectedPosition[],
    viewportMargin = 8
  ): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(elementRef)
      .withFlexibleDimensions(true)
      .withViewportMargin(viewportMargin)
      .withPositions(positions);
  }

  public addPanelClass(className: string): void {
    return this.overlayRef()?.addPanelClass(className);
  }

  public removePanelClass(className: string): void {
    return this.overlayRef()?.removePanelClass(className);
  }
}
