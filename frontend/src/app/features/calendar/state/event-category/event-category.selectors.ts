import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventCategoryState } from '../../models/event-category.model';

/**
 * Selectors for event-category feature slice.
 *
 * Context:
 * - Exposes full category list, loading state, and error info.
 * - Used in CalendarComponent and AdminComponent to drive UI.
 */

export const selectEventCategoriesState =
  createFeatureSelector<EventCategoryState>('eventCategories');

export const selectAllCategories = createSelector(
  selectEventCategoriesState,
  (state) => state.categories,
);

export const selectCategoriesLoading = createSelector(
  selectEventCategoriesState,
  (state) => state.loading,
);
