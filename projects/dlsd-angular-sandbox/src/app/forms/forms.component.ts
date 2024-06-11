import { Component } from '@angular/core';
import { InputsComponent } from './inputs/inputs.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [InputsComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {}
