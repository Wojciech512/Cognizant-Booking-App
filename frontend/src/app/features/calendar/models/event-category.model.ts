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
