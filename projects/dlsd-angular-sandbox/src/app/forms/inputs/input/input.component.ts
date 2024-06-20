import { Component } from '@angular/core';
import {
  DLSDElementOptionShortcutsDirective,
  DLSDInputComponent,
} from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [DLSDInputComponent, DLSDElementOptionShortcutsDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {}
