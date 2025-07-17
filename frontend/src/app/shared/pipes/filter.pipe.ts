import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generic filtering pipe for Angular templates.
 *
 * Context:
 * - Standalone pipe that takes an input array and a predicate function (plus optional args).
 * - Delegates filtering logic to the provided predicate, returning only matching items.
 * - Useful for concise, declarative filtering in component templates.
 */

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
