import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventCategoryState } from '../models/event-category.model';

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
