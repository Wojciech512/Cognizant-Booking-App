import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from './event-category.actions';
import { EventCategoryState } from '../../models/event-category.model';

/**
 * Reducer for event-category state: stores array and loading flag.
 *
 * Context:
 * - Updates state on load success/failure.
 */

const initialState: EventCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const eventCategoryReducer = createReducer(
  initialState,
  on(CategoryActions.loadEventCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CategoryActions.loadEventCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories,
  })),
  on(CategoryActions.loadEventCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CategoryActions.addEventCategory, (state) => ({
    ...state,
    error: null,
  })),
  on(CategoryActions.addEventCategorySuccess, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category],
  })),
  on(CategoryActions.addEventCategoryFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
