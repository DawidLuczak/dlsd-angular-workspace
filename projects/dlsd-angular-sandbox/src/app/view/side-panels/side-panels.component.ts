import { Component } from '@angular/core';
import {
  DLSDButtonComponent,
  DLSDSidePanelService,
} from '../../../../../dlsd-angular-ui/src/lib';
import { TooltipsComponent } from '../tooltips/tooltips.component';

@Component({
  selector: 'app-side-panels',
  standalone: true,
  imports: [DLSDButtonComponent],
  templateUrl: './side-panels.component.html',
  styleUrl: './side-panels.component.scss',
})
export class SidePanelsComponent {
  constructor(private sidePanel: DLSDSidePanelService) {}

  openSidePanel(): void {
    this.sidePanel.attachSidePanel({ component: TooltipsComponent });
  }
}
