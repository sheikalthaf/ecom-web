import { Component, computed, inject, OnInit } from '@angular/core';
import { Button, Icons, Menu, MenuTrigger } from '@meeui/ui';
import { provideIcons } from '@ng-icons/core';
import { lucideShoppingCart } from '@ng-icons/lucide';
import { CartService } from './cart.service';
import { AppState } from './store/product.store';
import { ImagePipe } from './admin/image.pipe';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [Icons, Button, Menu, MenuTrigger, ImagePipe, RouterLink],
  viewProviders: [provideIcons({ lucideShoppingCart })],
  selector: 'az-header',
  template: `
    <!-- <img src="assets/logo.svg" alt="Ecom Logo" class="h-full mx-auto" /> -->
    <a class="font-semibold text-base" routerLink="/">Angular store</a>

    <button
      meeButton
      variant="icon"
      class="ml-auto"
      [meeMenuTrigger]="cartMenu"
    >
      <mee-icon name="lucideShoppingCart" class="mr-2" />
      {{ addToCart.cartCount() }}
    </button>

    <mee-menu #cartMenu>
      <div class="flex flex-col w-72 p-b gap-b2">
        @for (item of items(); track item) {
          <div class="flex">
            <div class="w-12">
              <img
                class="max-h-56 mx-auto"
                [src]="item.Image?.[0] | image: true"
              />
            </div>
            <div class="p-b">
              <h4>Product {{ item.Name }}</h4>
              <p>{{ item.qty }}</p>
            </div>
          </div>
        }
        <div class="flex gap-b mt-b2">
          <button
            meeButton
            variant="primary"
            class="w-full"
            (click)="addToCart.clearCart()"
          >
            Clear Cart
          </button>
          <button
            meeButton
            variant="primary"
            class="w-full"
            routerLink="/checkout"
          >
            Checkout
          </button>
        </div>
      </div>
    </mee-menu>
  `,
  host: {
    class:
      'border-b h-[50px] flex items-center fixed top-0 left-0 w-full backdrop-blur-3xl bg-foreground bg-opacity-50 px-b4',
  },
})
export class HeaderComponent {
  addToCart = inject(CartService);
  private productStore = inject(AppState);

  items = computed(() => {
    const products = this.productStore.products();
    return this.addToCart.items().map((item) => {
      const product = products.find((x) => x.Id === item.id);
      return { ...product, qty: item.qty };
    });
  });
}
