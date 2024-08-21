import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'maintainer',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.AdminRoutes),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
];
