import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TooltipDirective } from '../../../../../dlsd-angular-ui/src/lib/view/tooltip';

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipsComponent {}
