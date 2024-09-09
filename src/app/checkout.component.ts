import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TableComponents } from './admin/category/category-list.component';
import { CartService } from './cart.service';
import { AppState } from './store/product.store';
import { Product } from './models/product';
import { ImagePipe } from './admin/image.pipe';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';
import { Button, Icon } from '@meeui/ui';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [TableComponents, ImagePipe, Icon, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
  template: `
    @if (products().length === 0) {
      <div class="flex min-h-[70vh] items-center justify-center">
        <p>No items in cart</p>
      </div>
    } @else {
      <div class="max-w-5xl mx-auto my-b4">
        <h4 class="text-xl font-bold p-b4">Checkout</h4>
        <table meeTable [data]="products()" [trackBy]="trackBy" class="w-full">
          <ng-container meeRow="product">
            <th meeHead *meeHeadDef>Product</th>
            <td meeCell *meeCellDef="let element">
              <div class="flex">
                <img class="w-16 h-16" [src]="element.Image[0] | image: true" />
                <div class="p-b">
                  <h4 class="font-semibold">{{ element.Name }}</h4>
                </div>
              </div>
            </td>
          </ng-container>
          <ng-container meeRow="qty">
            <th meeHead *meeHeadDef>Quantity</th>
            <td meeCell *meeCellDef="let element">{{ element.qty }}</td>
          </ng-container>
          <ng-container meeRow="price">
            <th meeHead *meeHeadDef>Price</th>
            <td meeCell *meeCellDef="let element">{{ element.Price }}</td>
          </ng-container>
          <ng-container meeRow="total">
            <th meeHead *meeHeadDef>Total</th>
            <td meeCell *meeCellDef="let element">
              {{ element.qty * element.Price }}
            </td>
          </ng-container>
          <ng-container meeRow="action">
            <th meeHead *meeHeadDef></th>
            <td meeCell *meeCellDef="let element">
              <button
                meeButton
                variant="icon"
                class="w-8 h-8"
                (click)="removeItem(element)"
              >
                <mee-icon name="lucideTrash2" />
              </button>
            </td>
          </ng-container>

          <tr meeHeadRow *meeHeadRowDef="columns"></tr>
          <tr meeBodyRow *meeBodyRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    }
  `,
})
export class CheckoutComponent {
  cart = inject(CartService);
  appState = inject(AppState);
  columns = ['product', 'qty', 'price', 'total', 'action'];
  trackBy = (index: number, item: any) => item.Id;

  products = computed(() => {
    const items = this.cart.items();
    const products = this.appState.products();
    const ps = items.map((item) => {
      const product = products.find((x) => x.Id === item.id);
      return {
        ...product,
        qty: item.qty,
      };
    });
    console.log(ps);
    return ps;
  });

  removeItem(product: Product) {
    this.cart.removeItem(product);
  }
}
