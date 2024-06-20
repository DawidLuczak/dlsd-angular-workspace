import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dlsdHighlight',
  standalone: true,
})
export class DLSDHighlightPipe implements PipeTransform {
  public transform(
    value: string,
    query: string,
    className = 'highlight'
  ): string {
    if (!query) return value;

    const regExp = new RegExp(query, 'ig');
    return value.replace(regExp, `<span class="${className}">$&</span>`);
  }
}
