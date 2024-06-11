import { Component } from '@angular/core';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { TimepickerComponent } from './timepicker/timepicker.component';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    TimepickerComponent,
    DatepickerComponent,
  ],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss',
})
export class InputsComponent {}
