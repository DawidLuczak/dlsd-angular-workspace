import { Component } from '@angular/core';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { ToastsComponent } from './toasts/toasts.component';
import { TooltipsComponent } from './tooltips/tooltips.component';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [DropdownsComponent, ToastsComponent, TooltipsComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {}
