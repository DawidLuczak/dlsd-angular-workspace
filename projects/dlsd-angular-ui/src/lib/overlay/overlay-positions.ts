import { ConnectedPosition } from '@angular/cdk/overlay';

export enum OverlayPosition {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

const positionStrategyTop = (): ConnectedPosition => {
  return {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    panelClass: ['top'],
  };
};

const positionStrategyBottom = (): ConnectedPosition => {
  return {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: ['bottom'],
  };
};

const positionStrategyRight = (): ConnectedPosition => {
  return {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    panelClass: ['right'],
  };
};

const positionStrategyLeft = (): ConnectedPosition => {
  return {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    panelClass: ['left'],
  };
};

export default {
  positionStrategyTop,
  positionStrategyBottom,
  positionStrategyLeft,
  positionStrategyRight,
};
