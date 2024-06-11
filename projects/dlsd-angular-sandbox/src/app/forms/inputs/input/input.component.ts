import { Component } from '@angular/core';
import { DLSDInputComponent } from '../../../../../../dlsd-angular-ui/src/lib/inputs';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [DLSDInputComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {}
