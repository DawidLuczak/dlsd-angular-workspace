import { Component } from '@angular/core';
import { DLSDInputComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [DLSDInputComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {}
