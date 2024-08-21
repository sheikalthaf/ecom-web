import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucidePencil } from '@ng-icons/lucide';
import { CategoryService } from '../../category.service';
import { Category } from '../../models/category';
import { AddCategoryComponent } from './add-category.component';
import { AppState } from '../../store/product.store';
import {
  Button,
  Icons,
  Table,
  Row,
  Head,
  HeadRow,
  BodyRowDef,
  HeadRowDef,
  HeadDef,
  BodyRow,
  Cell,
  CellDef,
  dialogPortal,
} from '@meeui/ui';

export const TableComponents = [
  BodyRow,
  BodyRowDef,
  Cell,
  CellDef,
  Head,
  HeadDef,
  HeadRow,
  HeadRowDef,
  Row,
  Table,
];

@Component({
  standalone: true,
  imports: [AsyncPipe, TableComponents, Icons, Button, AddCategoryComponent],
  providers: [provideIcons({ lucideTrash2, lucidePencil })],
  selector: 'az-category-list',
  template: `
    <div class="text-right m-2">
      <button id="edit-profile" meeButton (click)="open()">Add Category</button>
    </div>
    <table
      meeTable
      [data]="categories()"
      [trackBy]="trackByFn"
      class="w-full min-w-[400px] overflow-auto"
    >
      <ng-container meeRow="Name">
        <th class="w-52" meeHead *meeHeadDef>Name</th>
        <td class="w-52" meeCell *meeCellDef="let element">
          {{ element.Name }}
        </td>
      </ng-container>
      <ng-container meeRow="Description">
        <th meeHead *meeHeadDef>Description</th>
        <td meeCell *meeCellDef="let element">
          {{ element.Description }}
        </td>
      </ng-container>
      <ng-container meeRow="Action">
        <th class="w-40" meeHead *meeHeadDef>Action</th>
        <td class="w-40" meeCell *meeCellDef="let element">
          <mee-icon
            class="cursor-pointer"
            name="lucidePencil"
            (click)="editCategory(element)"
          ></mee-icon>
          <mee-icon
            class="cursor-pointer"
            name="lucideTrash2"
            (click)="deleteCategory(element)"
          ></mee-icon>
        </td>
      </ng-container>

      <tr meeHeadRow *meeHeadRowDef="columns()"></tr>
      <tr
        meeBodyRow
        *meeBodyRowDef="let row; columns: columns()"
        class="cursor-pointer"
      ></tr>

      <!-- <hlm-trow>
        <hlm-th class="w-52">Name</hlm-th>
        <hlm-th class="w-60">Description</hlm-th>
        <hlm-th class="flex-1"></hlm-th>
        <hlm-th class="w-40">Action</hlm-th>
      </hlm-trow>
      @for (category of categories(); track category.Id) {
      <hlm-trow>
        <hlm-td truncate class="w-52 font-medium">{{ category.Name }}</hlm-td>
        <hlm-td class="w-60">{{ category.Description }}</hlm-td>
        <hlm-td class="flex-1"></hlm-td>
        <hlm-td class="w-40">
          <hlm-icon
            class="cursor-pointer"
            name="lucidePencil"
            (click)="editCategory(category)"
          ></hlm-icon>
          <hlm-icon
            class="cursor-pointer"
            name="lucideTrash2"
            (click)="deleteCategory(category)"
          ></hlm-icon>
        </hlm-td>
      </hlm-trow>
      } -->
    </table>
  `,
})
export class CategoryListComponent {
  private dialog = dialogPortal();
  private categoryService = inject(CategoryService);
  private store = inject(AppState);
  categories = this.store.categories;
  columns = signal(['Name', 'Description', 'Action']);
  trackByFn = (index: number, item: Category) => item.Id;

  constructor() {
    this.store.getCategories();
  }

  open() {
    this.dialog.open(AddCategoryComponent, {
      title: 'Add Category',
    });
  }

  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.Id!).subscribe((res) => {
      console.log('Product deleted');
    });
  }

  editCategory(category: Category) {
    console.log('Edit Product', category);
  }
}
