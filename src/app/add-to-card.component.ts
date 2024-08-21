import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CartService } from './cart.service';
import { Product } from './models/product';
import { Button } from '@meeui/ui';

@Component({
  standalone: true,
  selector: 'app-add-to-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    @if (qty() > 0) {
      <p class="text-green-500 text-sm">Added to cart</p>
    } @else {
      <button
        meeButton
        class="small"
        (click)="
          $event.stopPropagation();
          $event.preventDefault();
          cart.addToCart(product())
        "
      >
        Add to Cart
      </button>
    }
  `,
})
export class AddToCardComponent {
  cart = inject(CartService);
  product = input.required<Product>();

  qty = computed(() => {
    const product = this.product();
    const items = this.cart.items();
    const item = items.find((x) => x.id === product.Id);
    return item ? item.qty : 0;
  });
}
