import { Component } from '@angular/core';
import { FormControlsGroupComponent } from './form-controls-group/form-controls-group.component';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [FormControlsGroupComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {}
