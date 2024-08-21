import { Component, inject } from '@angular/core';
import { ImagePipe } from './admin/image.pipe';
import { ProductService } from './product.service';
import { computedAsync } from 'ngxtension/computed-async';
import { ActivatedRoute } from '@angular/router';
import { AppState } from './store/product.store';
import { Button, Spinner } from '@meeui/ui';
import { CartService } from './cart.service';
import { AddToCardComponent } from './add-to-card.component';

@Component({
  standalone: true,
  imports: [ImagePipe, Spinner, Button, AddToCardComponent],
  selector: 'app-product-detail',
  template: `
    @if (product(); as p) {
      <div class="grid lg:grid-cols-2 gap-8 p-8">
        <div class="rounded-md overflow-hidden border">
          <img class="max-h-[32rem] mx-auto" [src]="p.Image[0] | image" />
        </div>
        <div>
          <h3 class="text-title font-bold">Description</h3>
          <p class="text-text text-sm">
            {{ p.Description }}
          </p>
          <div class="py-2 mt-4">
            <h4 class="text-title font-bold mb-2">Details</h4>
            <p class="text-text text-sm">Size: {{ p.Size }}</p>
            <p class="text-text text-sm">Code: {{ p.ProductCode }}</p>
            <p class="font-bold mt-1 text-text">₹{{ p.Price }}</p>
          </div>

          <app-add-to-card [product]="p"></app-add-to-card>
        </div>
      </div>
    } @else {
      <div class="flex min-h-[70vh] items-center justify-center">
        <mee-spinner />
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private productStore = inject(AppState);
  readonly cartService = inject(CartService);

  product = computedAsync(() => {
    const id = this.activatedRoute.snapshot.params['id'];
    const p = this.productStore.getProduct(id)!;
    return p() || this.productService.getProduct(id);
  });
}
