import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to generate a consistent HSL color string from a numeric category ID.
 *
 * Context:
 * - Used to visually distinguish calendar/event categories by color.
 * - Applies the “golden-angle” heuristic (137°) to spread hues evenly around the color wheel.
 * - Marked standalone + pure for optimal tree-shaking and change-detection performance.
 */

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
