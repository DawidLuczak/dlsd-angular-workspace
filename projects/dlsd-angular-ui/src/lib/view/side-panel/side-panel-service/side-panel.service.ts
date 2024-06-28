import { Overlay } from '@angular/cdk/overlay';
import { Injectable, ViewContainerRef } from '@angular/core';
import { DLSDOverlayService } from '../../../overlay/overlay-service/overlay.service';
import { DLSDSidePanelConfig } from '../interfaces';
import {
  DLSDSidePanelComponent,
  DLSD_SIDE_PANEL_CONFIG,
} from '../side-panel/side-panel.component';

@Injectable({
  providedIn: 'root',
})
class SidePanelOverlayService extends DLSDOverlayService {
  constructor(protected override overlay: Overlay) {
    super(overlay);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DLSDSidePanelService {
  constructor(private overlayService: SidePanelOverlayService) {}

  public attachSidePanel(
    config: DLSDSidePanelConfig,
    viewContainerRef?: ViewContainerRef
  ): void {
    if (this.overlayService.overlayRef()?.hasAttached()) return;

    if (!this.overlayService.overlayRef()) {
      this.overlayService.createAndSetOverlayRef({
        height: '100%',
        positionStrategy: this.overlayService.position.global().right(),
      });
    }

    this.overlayService.attachToOverlay(
      this.overlayService.createComponentPortal(
        DLSDSidePanelComponent,
        viewContainerRef,
        this.overlayService.createComponentInjector(DLSD_SIDE_PANEL_CONFIG, {
          close: () => this.overlayService.detachFromOverlay(),
          ...config,
        })
      )
    );
  }

  public detachSidePanel(): void {
    this.overlayService.detachFromOverlay();
  }
}
