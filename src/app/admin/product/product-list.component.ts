import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductService } from '../../product.service';
import { AddProductComponent } from './add-product.component';
import { AsyncPipe } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucidePencil } from '@ng-icons/lucide';
import { Product } from '../../models/product';
import { Button, Card, dialogPortal, Icons } from '@meeui/ui';
import { TableComponents } from '../category/category-list.component';
import { computedAsync } from 'ngxtension/computed-async';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    TableComponents,
    Icons,
    Button,
    AddProductComponent,
    Card,
  ],
  providers: [provideIcons({ lucideTrash2, lucidePencil })],
  selector: 'az-product-list',
  template: `
    <div class="text-right m-2">
      <button id="edit-profile" meeButton (click)="addProduct()">
        Add Product
      </button>
    </div>
    <mee-card class="!p-0">
      <table
        meeTable
        [data]="products()"
        [trackBy]="trackByFn"
        class="w-full min-w-[400px] overflow-auto"
      >
        <ng-container meeRow="Name">
          <th class="w-52" meeHead *meeHeadDef>Name</th>
          <td class="w-52" meeCell *meeCellDef="let element">
            {{ element.Name }}
          </td>
        </ng-container>
        <ng-container meeRow="Code">
          <th meeHead *meeHeadDef>Code</th>
          <td meeCell *meeCellDef="let element">
            {{ element.ProductCode }}
          </td>
        </ng-container>
        <ng-container meeRow="Category">
          <th meeHead *meeHeadDef>Category</th>
          <td meeCell *meeCellDef="let element">
            {{ element.CategoryName }}
          </td>
        </ng-container>
        <ng-container meeRow="Size">
          <th meeHead *meeHeadDef>Size</th>
          <td meeCell *meeCellDef="let element">
            {{ element.Size }}
          </td>
        </ng-container>
        <ng-container meeRow="Quantity">
          <th meeHead *meeHeadDef>Quantity</th>
          <td meeCell *meeCellDef="let element">
            {{ element.Quantity }}
          </td>
        </ng-container>
        <ng-container meeRow="Price">
          <th meeHead *meeHeadDef>Price</th>
          <td meeCell *meeCellDef="let element">
            {{ element.Price }}
          </td>
        </ng-container>
        <ng-container meeRow="Action">
          <th meeHead *meeHeadDef>Action</th>
          <td meeCell *meeCellDef="let element">
            <mee-icon
              class="cursor-pointer"
              name="lucidePencil"
              (click)="editProduct(element)"
            ></mee-icon>
            <mee-icon
              class="cursor-pointer"
              name="lucideTrash2"
              (click)="deleteProduct(element)"
            ></mee-icon>
          </td>
        </ng-container>

        <tr meeHeadRow *meeHeadRowDef="columns()"></tr>
        <tr
          meeBodyRow
          *meeBodyRowDef="let row; columns: columns()"
          class="cursor-pointer"
        ></tr>
      </table>
    </mee-card>
  `,
  host: {
    class: 'block p-4',
  },
})
export class ProductListComponent {
  private dialog = dialogPortal();
  private productService = inject(ProductService);
  products = computedAsync(
    async () => {
      const v = await firstValueFrom(this.productService.getProducts());
      return v || [];
    },
    { initialValue: [] },
  );
  columns = signal([
    'Name',
    'Code',
    'Category',
    'Size',
    'Quantity',
    'Price',
    'Action',
  ]);
  trackByFn = (index: number, item: Product) => item.Id;

  addProduct() {
    this.dialog.open(AddProductComponent, {
      title: 'Add Product',
    });
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.Id!).subscribe((res) => {
      console.log('Product deleted');
    });
  }

  editProduct(product: Product) {
    console.log('Edit Product', product);
  }
}
