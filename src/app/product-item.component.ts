import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Product } from './models/product';
import { CartService } from './cart.service';
import { ImagePipe } from './admin/image.pipe';
import { Button } from '@meeui/ui';
import { AddToCardComponent } from './add-to-card.component';

@Component({
  standalone: true,
  selector: 'app-product-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    ImagePipe,
    Button,
    AddToCardComponent,
  ],
  template: `
    <a
      [routerLink]="product().Id"
      routerLinkActive="router-link-active"
      class="rounded-md overflow-hidden"
    >
      <img class="max-h-56 mx-auto" [src]="product().Image[0] | image: true" />
      <div class="p-2">
        <h4 class="text-title font-bold">Product {{ product().Name }}</h4>
        <p class="text-text text-sm">Size: {{ product().Size }}</p>
        <p class="text-text text-sm">Code: {{ product().ProductCode }}</p>
        <p class="font-bold mt-1 text-base">₹{{ product().Price }}</p>
        <app-add-to-card [product]="product()"></app-add-to-card>
      </div>
    </a>
  `,
  host: {
    class: 'block border',
  },
})
export class ProductItemComponent {
  addToCart = inject(CartService);
  product = input.required<Product>();

  qty = computed(() => {
    const product = this.product();
    const items = this.addToCart.items();
    const item = items.find((x) => x.id === product.Id);
    return item ? item.qty : 0;
  });
}
