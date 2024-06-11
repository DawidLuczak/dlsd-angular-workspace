import { Component } from '@angular/core';
import { DLSDDatepickerComponent } from '../../../../../dlsd-angular-ui/src/lib/inputs';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [DLSDDatepickerComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {}
