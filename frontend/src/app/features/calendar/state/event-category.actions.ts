import { createAction, props } from '@ngrx/store';
import {EventCategory, EventCategoryError} from '../models/event-category.model';

export const loadEventCategories = createAction(
  '[EventCategory] Load Categories',
);
export const loadEventCategoriesSuccess = createAction(
  '[EventCategory] Load Categories Success',
  props<{ categories: EventCategory[] }>(),
);
export const loadEventCategoriesFailure = createAction(
  '[EventCategory] Load Categories Failure',
  props<{ error: EventCategoryError }>(),
);

export const addEventCategory = createAction(
  '[EventCategory] Add Category',
  props<{ name: string }>(),
);
export const addEventCategorySuccess = createAction(
  '[EventCategory] Add Category Success',
  props<{ category: EventCategory }>(),
);
export const addEventCategoryFailure = createAction(
  '[EventCategory] Add Category Failure',
  props<{ error: EventCategoryError }>(),
);
