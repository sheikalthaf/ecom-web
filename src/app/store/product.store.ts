import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ProductService } from '../product.service';
import { computed, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { CategoryService } from '../category.service';

interface ProductState {
  products: Product[];
  categories: Category[];
}

const initialState: ProductState = {
  products: [],
  categories: [],
};

export const AppState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, productService = inject(ProductService)) => ({
    getProducts: rxMethod<void>(
      switchMap(() => {
        console.log('getProducts');
        return productService.getProducts().pipe(
          tapResponse({
            next: (res) => {
              patchState(store, (state) => ({ ...state, products: res }));
            },
            error: (err) => {
              console.error(err);
            },
          })
        );
      })
    ),
    setProducts: (products: Product[]) =>
      patchState(store, (state) => ({ ...state, products })),
    addProduct: (product: Product) =>
      patchState(store, (state) => ({
        ...state,
        products: [...state.products, product],
      })),
    deleteProduct: (id: string) =>
      patchState(store, (state) => ({
        ...state,
        products: state.products.filter((product) => product.Id !== id),
      })),
    getProduct: (id: string) =>
      computed(() => store.products().find((product) => product.Id === id)),
  })),
  withMethods((store, categoryService = inject(CategoryService)) => ({
    getCategories: rxMethod<void>(
      switchMap(() => {
        return categoryService.getCategories().pipe(
          tapResponse({
            next: (res) => {
              patchState(store, (state) => ({ ...state, categories: res }));
            },
            error: (err) => {
              console.error(err);
            },
          })
        );
      })
    ),
    setCategories: (categories: Category[]) =>
      patchState(store, (state) => ({ ...state, categories })),
    addCategory: (category: Category) =>
      patchState(store, (state) => ({
        ...state,
        categories: [...state.categories, category],
      })),
    deleteCategory: (id: string) =>
      patchState(store, (state) => ({
        ...state,
        categories: state.categories.filter((category) => category.Id !== id),
      })),
    getCategory: (id: string) =>
      computed(() => store.categories().find((category) => category.Id === id)),
  })),
  withComputed(({ products, categories }) => ({
    products: products,
    categories: categories,
  }))
);
