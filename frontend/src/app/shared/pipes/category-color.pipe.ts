import { Pipe, PipeTransform } from '@angular/core';

const CATEGORY_COLORS: { [key: number]: string } = {
  1: 'primary',
  2: 'accent',
  3: 'warn',
};

@Pipe({
  name: 'categoryColor',
  standalone: true,
})
export class CategoryColorPipe implements PipeTransform {
  transform(categoryId: number): string {
    return CATEGORY_COLORS[categoryId] || 'primary';
  }
}
