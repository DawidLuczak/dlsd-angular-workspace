import { Component } from '@angular/core';
import { DLSDCheckboxComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [DLSDCheckboxComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {}
