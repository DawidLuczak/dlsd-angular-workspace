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
    title: 'inputs',
    component: InputsComponent,
    path: 'inputs',
    children: [
      {
        title: 'input',
        component: InputComponent,
        path: 'input',
      },
      {
        title: 'select',
        component: SelectComponent,
        path: 'select',
      },
      {
        title: 'datepicker',
        component: DatepickerComponent,
        path: 'datepicker',
      },
      {
        title: 'timepicker',
        component: TimepickerComponent,
        path: 'timepicker',
      },
      {
        title: 'checkbox',
        component: CheckboxComponent,
        path: 'checkbox',
      },
      {
        title: 'radio button',
        component: RadioButtonComponent,
        path: 'radio-button',
      },
      {
        title: 'switch',
        component: SwitchComponent,
        path: 'switch',
      },
    ],
  },
];
