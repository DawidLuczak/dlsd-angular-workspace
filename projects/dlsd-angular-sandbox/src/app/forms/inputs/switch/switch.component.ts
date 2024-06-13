import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DLSDSwitchComponent } from '../../../../../../dlsd-angular-ui/src/public-api';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [DLSDSwitchComponent, ReactiveFormsModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
})
export class SwitchComponent {
  protected form = this.fb.group({
    disabled: this.fb.control({ value: false, disabled: true }),
  });

  constructor(private fb: FormBuilder) {}
}
