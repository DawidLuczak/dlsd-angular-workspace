import { Component } from '@angular/core';
import { InputComponent } from './input/input.component';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss',
})
export class InputsComponent {}
