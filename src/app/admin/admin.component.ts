import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Selectable, SelectableItem } from '@meeui/ui';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    Selectable,
    SelectableItem,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'az-admin-page',
  template: `
    <mee-selectable class="w-fit" [(activeIndex)]="activeIndex">
      <a
        meeSelectableItem
        [value]="0"
        [routerLink]="['/maintainer/products']"
        routerLinkActive=""
        (isActiveChange)="$event && routeChange(0)"
        class=" p-2"
      >
        Products
      </a>
      <a
        meeSelectableItem
        [value]="1"
        [routerLink]="['/maintainer/categories']"
        routerLinkActive=""
        (isActiveChange)="$event && routeChange(1)"
        class="p-2"
      >
        Categories
      </a>
    </mee-selectable>
    <router-outlet></router-outlet>
  `,
})
export class AdminPageComponent {
  activeIndex = signal(0);

  routeChange(index: number) {
    this.activeIndex.set(index);
  }
}
