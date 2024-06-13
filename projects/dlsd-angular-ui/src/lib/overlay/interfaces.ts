import { ConnectedPosition } from '@angular/cdk/overlay';
import { OverlayPosition } from './overlay-positions';

export interface DLSDCustomOverlayConfig {
  attachElementRef?: boolean;
  hasBackdrop?: boolean;
  hostCss: ('s' | 'm' | 'l' | 'fill' | 'dark')[];
  positions?: OverlayPosition[];
  overridePositions?: Partial<ConnectedPosition>;
  targetRef?: HTMLElement;
}
