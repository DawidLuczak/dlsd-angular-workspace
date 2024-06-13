import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dlsdHighlight',
  standalone: true,
})
export class DLSDHighlightPipe implements PipeTransform {
  public transform(value: string, query: string): string {
    if (!query) return value;

    const regExp = new RegExp(query, 'ig');
    return value.replace(regExp, '<span class="highlight">$&</span>');
  }
}
