import { Component, computed, inject } from '@angular/core';
import {
  Button,
  DialogClose,
  Icon,
  Input,
  Label,
  Menu,
  popoverPortal,
  PopoverTrigger,
} from '@meeui/ui';
import { provideIcons } from '@ng-icons/core';
import { lucideShoppingCart } from '@ng-icons/lucide';
import { CartService } from './cart.service';
import { AppState } from './store/product.store';
import { ImagePipe } from './admin/image.pipe';
import { RouterLink } from '@angular/router';
import { UserState } from './store/user.store';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginComponent } from './login.component';

@Component({
  standalone: true,
  imports: [
    Icon,
    Button,
    Menu,
    PopoverTrigger,
    ImagePipe,
    RouterLink,
    DialogClose,
    Input,
    Label,
    ReactiveFormsModule,
  ],
  viewProviders: [provideIcons({ lucideShoppingCart })],
  selector: 'az-header',
  template: `
    <!-- <img src="assets/logo.svg" alt="Ecom Logo" class="h-full mx-auto" /> -->
    <a class="font-semibold text-base" routerLink="/">Angular store</a>

    @if (user()) {
      <button
        meeButton
        variant="icon"
        class="ml-auto"
        [meePopoverTrigger]="cartMenu"
        [options]="{ position: 'br' }"
      >
        <mee-icon name="lucideShoppingCart" class="mr-2" />
        {{ addToCart.cartCount() }}
      </button>
    } @else {
      <button
        meeButton
        variant="primary"
        class="ml-auto"
        (click)="login($event)"
      >
        Login
      </button>
    }

    <ng-template #cartMenu>
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
            meeDialogClose
            (click)="addToCart.clearCart()"
          >
            Clear Cart
          </button>
          <button
            meeButton
            variant="primary"
            class="w-full"
            routerLink="/checkout"
            meeDialogClose
          >
            Checkout
          </button>
        </div>
      </div>
    </ng-template>
  `,
  host: {
    class:
      'border-b h-[50px] flex items-center sticky top-0 w-full backdrop-blur-3xl bg-foreground bg-opacity-50 px-b4',
  },
})
export class HeaderComponent {
  addToCart = inject(CartService);
  readonly popover = popoverPortal();
  private productStore = inject(AppState);
  private userStore = inject(UserState);
  readonly form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  items = computed(() => {
    const products = this.productStore.products();
    return this.addToCart.items().map((item) => {
      const product = products.find((x) => x.Id === item.id);
      return { ...product, qty: item.qty };
    });
  });

  user = computed(() => this.userStore.user());

  login(event: Event) {
    this.popover.open(
      LoginComponent,
      {
        target: event.target as HTMLElement,
        position: 'br',
      },
      {
        width: '400px',
      },
    );
  }

  register() {
    this.form.reset();
  }
}
