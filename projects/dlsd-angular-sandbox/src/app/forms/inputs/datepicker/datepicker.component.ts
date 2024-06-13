import { Component } from '@angular/core';
import { DLSDDatepickerComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [DLSDDatepickerComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {}
