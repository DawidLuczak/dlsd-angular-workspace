import { Component } from '@angular/core';
import { ControlsComponent } from './controls/controls.component';
import { InputsComponent } from './inputs/inputs.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [InputsComponent, ControlsComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {}
