import { computed, Injectable, signal } from '@angular/core';
import { Product } from './models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<{ id: string; qty: number }[]>([]);
  readonly cartCount = computed(() => this.items().length);

  addToCart(product: Product) {
    this.items.update((x) => {
      const index = x.findIndex((y) => y.id === product.Id);
      if (index === -1) {
        x.push({ id: product.Id, qty: 1 });
      } else {
        x[index].qty += 1;
      }
      return [...x];
    });
  }

  getItems() {
    return this.items();
  }

  removeItem(product: Product) {
    this.items.update((x) => x.filter((y) => y.id != product.Id));
  }

  clearCart() {
    this.items.set([]);
    return this.items();
  }
}
