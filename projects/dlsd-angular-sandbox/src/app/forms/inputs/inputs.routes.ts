import { Routes } from '@angular/router';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { InputsComponent } from './inputs.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SelectComponent } from './select/select.component';
import { SwitchComponent } from './switch/switch.component';
import { TimepickerComponent } from './timepicker/timepicker.component';

export const inputsRoutes: Routes = [
  {
    title: 'Inputs',
    path: 'inputs',
    component: InputsComponent,
    children: [
      {
        title: 'Input',
        path: 'input',
        component: InputComponent,
      },
      {
        title: 'Select',
        path: 'select',
        component: SelectComponent,
      },
      {
        title: 'Datepicker',
        path: 'datepicker',
        component: DatepickerComponent,
      },
      {
        title: 'Timepicker',
        path: 'timepicker',
        component: TimepickerComponent,
      },
      {
        title: 'Checkbox',
        path: 'checkbox',
        component: CheckboxComponent,
      },
      {
        title: 'Radio button',
        path: 'radio-button',
        component: RadioButtonComponent,
      },
      {
        title: 'Switch',
        path: 'switch',
        component: SwitchComponent,
      },
    ],
  },
];
