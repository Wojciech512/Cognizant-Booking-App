/**
 * Domain model for an event category.
 *
 * Context:
 * - Categories group and color-code different time slots.
 * - Used by CategoryColorPipe to generate display colors.
 */

export interface EventCategory {
  id: number;
  name: string;
  color: string;
}

export interface EventCategoryState {
  categories: EventCategory[];
  loading: boolean;
  error: EventCategoryError;
}

export type EventCategoryError = string | null | undefined;
