import { Component } from '@angular/core';
import { DLSDTimepickerComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [DLSDTimepickerComponent],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
})
export class TimepickerComponent {}
