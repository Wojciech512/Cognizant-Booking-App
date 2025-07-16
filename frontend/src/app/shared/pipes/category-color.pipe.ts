import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryColor',
  standalone: true,
  pure: true,
})
export class CategoryColorPipe implements PipeTransform {
  transform(categoryId: number): string {
    const hue = (categoryId * 137) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  }
}
