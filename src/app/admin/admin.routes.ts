import { Route } from '@angular/router';
import { AdminPageComponent } from './admin.component';

export const AdminRoutes: Route[] = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./product/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./category/category-list.component').then(
            (m) => m.CategoryListComponent
          ),
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];
