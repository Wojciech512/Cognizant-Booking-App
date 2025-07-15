import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { EventCategoryService } from '../services/event-category.service';
import * as CategoryActions from './event-category.actions';

@Injectable()
export class EventCategoryEffects {
  private actions$ = inject(Actions);
  private categoryService = inject(EventCategoryService);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadEventCategories),
      mergeMap(() =>
        this.categoryService.getAllCategories().pipe(
          map((categories) =>
            CategoryActions.loadEventCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(CategoryActions.loadEventCategoriesFailure({ error })),
          ),
        ),
      ),
    ),
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addEventCategory),
      mergeMap((action) =>
        this.categoryService.createCategory(action.name).pipe(
          map((newCategory) =>
            CategoryActions.addEventCategorySuccess({ category: newCategory }),
          ),
          catchError((error) =>
            of(CategoryActions.addEventCategoryFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
