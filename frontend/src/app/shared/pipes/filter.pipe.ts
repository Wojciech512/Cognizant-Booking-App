import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T, A extends unknown[]>(
    items: T[] = [],
    predicate: (item: T, ...args: A) => boolean,
    ...args: A
  ): T[] {
    return items.filter((item) => predicate(item, ...args));
  }
}
