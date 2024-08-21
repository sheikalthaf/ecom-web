import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from './product.service';
import { ImagePipe } from './admin/image.pipe';
import { RouterLink } from '@angular/router';
import { AppState } from './store/product.store';
import { Product } from './models/product';
import { Button } from '@meeui/ui';
import { CartService } from './cart.service';
import { ProductItemComponent } from './product-item.component';
@Component({
  standalone: true,
  imports: [ImagePipe, RouterLink, Button, ProductItemComponent],
  selector: 'app-products',
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-8 p-8">
      @for (product of products(); track $index) {
        <app-product-item [product]="product"></app-product-item>
      }
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  public addToCart = inject(CartService);
  arrs = Array.from(
    { length: 50 },
    (_, i) =>
      ({
        Id: i.toString(),
        ProductCode: `Code ${i}`,
        Name: `Name ${i}`,
        Price: i * 100,
        Image: ['images/product/25d53889-0a31-4be6-96dc-669ca7bd2cb8.jpeg'],
        IsDeleted: false,
        Quantity: i * 10,
        Size: (i * 10).toString(),
      }) as Product,
  );
  private productService = inject(ProductService);
  private productStore = inject(AppState);

  products = this.productStore.products;

  constructor() {
    if (this.products().length === 0) {
      this.productStore.getProducts();
    }
  }

  ngOnInit() {}
}
