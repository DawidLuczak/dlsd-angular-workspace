import { Component } from '@angular/core';
import { TooltipDirective } from '../../../../dlsd-angular-ui/src/lib/tooltip';

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.scss',
})
export class TooltipsComponent {}
