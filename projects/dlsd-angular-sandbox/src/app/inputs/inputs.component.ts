import { Component } from '@angular/core';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [InputComponent, SelectComponent],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss',
})
export class InputsComponent {}
