import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DLSDRadioButtonComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [DLSDRadioButtonComponent, ReactiveFormsModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
})
export class RadioButtonComponent {
  protected form = this.fb.group({
    radio: this.fb.control('1'),
  });

  constructor(private fb: FormBuilder) {}
}
