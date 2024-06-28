import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
} from '@angular/core';
import { DLSDCloseButtonComponent } from '../../../buttons';
import { DLSDSidePanelConfig } from '../interfaces';

export const DLSD_SIDE_PANEL_CONFIG = new InjectionToken<DLSDSidePanelConfig>(
  'Side panel config'
);

@Component({
  selector: 'dlsd-side-panel',
  standalone: true,
  imports: [DLSDCloseButtonComponent, NgComponentOutlet, NgTemplateOutlet],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDSidePanelComponent {
  constructor(
    @Inject(DLSD_SIDE_PANEL_CONFIG) protected config: DLSDSidePanelConfig
  ) {}
}
