import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  DLSDFormControlsGroupComponent,
  DLSDInputComponent,
  DLSDSelectComponent,
} from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-form-controls-group',
  standalone: true,
  imports: [
    DLSDFormControlsGroupComponent,
    DLSDInputComponent,
    DLSDSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form-controls-group.component.html',
  styleUrl: './form-controls-group.component.scss',
})
export class FormControlsGroupComponent {
  protected form = this.fb.group({
    input: this.fb.control(''),
    select: this.fb.control(''),
  });

  constructor(private fb: FormBuilder) {}
}
