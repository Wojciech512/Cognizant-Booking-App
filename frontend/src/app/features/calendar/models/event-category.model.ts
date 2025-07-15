export interface EventCategory {
  id: number;
  name: string;
}

export interface EventCategoryState {
  categories: EventCategory[];
  loading: boolean;
  error: EventCategoryError;
}

export type EventCategoryError = string | null | undefined;
