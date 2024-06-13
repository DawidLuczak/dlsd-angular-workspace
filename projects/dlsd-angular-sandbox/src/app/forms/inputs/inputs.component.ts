import { Component } from '@angular/core';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SelectComponent } from './select/select.component';
import { SwitchComponent } from './switch/switch.component';
import { TimepickerComponent } from './timepicker/timepicker.component';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    TimepickerComponent,
    DatepickerComponent,
    CheckboxComponent,
    RadioButtonComponent,
    SwitchComponent,
  ],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss',
})
export class InputsComponent {}
