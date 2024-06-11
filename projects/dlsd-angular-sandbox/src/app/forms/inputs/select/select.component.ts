import { Component } from '@angular/core';
import { DLSDSelectComponent } from '../../../../../../dlsd-angular-ui/src/lib/inputs';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [DLSDSelectComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {}
