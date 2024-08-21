import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProductService } from '../../product.service';
import { LogicalService } from '../logical.service';
import { FileValueAccessor } from '../../shared/file-value.directive';
import { Product } from '../../models/product';
import { CategoryService } from '../../category.service';
import { AppState } from '../../store/product.store';
import {
  Button,
  DialogRef,
  Input,
  Label,
  Option,
  Select,
  SelectTrigger,
  Spinner,
} from '@meeui/ui';

@Component({
  standalone: true,
  selector: 'az-add-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FileValueAccessor,
    Spinner,
    Input,
    Label,
    Button,
    Select,
    Option,
    SelectTrigger,
  ],
  template: `<div>
    <div class="sm:max-w-[425px] max-h-[80vh] overflow-auto">
      <div class="grid gap-4 py-4" [formGroup]="form">
        <label meeLabel>
          Name
          <input
            class="w-80"
            meeInput
            type="text"
            placeholder="Name"
            formControlName="Name"
          />
        </label>
        <label meeLabel>
          Code
          <input
            class="w-80"
            meeInput
            type="text"
            placeholder="ProductCode"
            formControlName="ProductCode"
          />
        </label>
        <label meeLabel>
          Category
          <mee-select
            placeholder="Select an option"
            formControlName="CategoryId"
            [multiple]="false"
          >
            @for (category of categories(); track category.Id) {
              <mee-option [value]="category.Id">{{ category.Name }}</mee-option>
            }
          </mee-select>
        </label>
        <label meeLabel>
          Description
          <textarea
            class="w-80 min-h-[8rem]"
            meeInput
            type="text"
            placeholder="Description"
            formControlName="Description"
          ></textarea>
        </label>
        <label meeLabel>
          Size
          <input
            class="w-80"
            meeInput
            type="text"
            placeholder="Size"
            formControlName="Size"
          />
        </label>
        <label meeLabel>
          Quantity
          <input
            class="w-80"
            meeInput
            type="number"
            placeholder="Quantity"
            formControlName="Quantity"
          />
        </label>
        <label meeLabel>
          Price
          <input
            class="w-80"
            meeInput
            type="number"
            placeholder="Price"
            formControlName="Price"
          />
        </label>
        <label meeLabel>
          Image
          <input
            class="w-80"
            type="file"
            (change)="readUrl($event)"
            accept="image/jpeg, image/jpg"
            formControlName="Image"
          />
        </label>

        <!-- Image Preview -->
        <div
          class="w-80 h-40 bg-gray-200 rounded-md flex items-center justify-center"
        >
          @if (imgPreview(); as img) {
            <img [src]="img" alt="Product Image" class="max-h-full" />
          } @else {
            <p>No Image</p>
          }
        </div>
      </div>
      <div>
        <button
          meeButton
          type="submit"
          [disabled]="form.invalid"
          (click)="addProduct()"
        >
          @if (saving()) {
            <mee-spinner />
            Saving...
          } @else {
            Save changes
          }
        </button>
      </div>
    </div>
  </div>`,
})
export class AddProductComponent implements OnInit {
  private dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private logical = inject(LogicalService);
  private store = inject(AppState);
  categories = this.store.categories;

  form = this.fb.nonNullable.group({
    Id: [''],
    ProductCode: ['', Validators.required],
    Name: ['', Validators.required],
    CategoryId: ['', Validators.required],
    Size: ['', Validators.required],
    Quantity: [1, Validators.required],
    Price: [1, Validators.required],
    IsDeleted: [false],
    Image: ['', Validators.required],
    Description: [''],
  });

  imgPreview = signal('');
  saving = signal(false);

  constructor() {
    if (this.store.categories().length === 0) {
      this.store.getCategories();
    }
  }

  ngOnInit() {}

  readUrl(event: Event) {
    const file = (event.target as any)?.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const src = e.srcElement || e.target;
        this.imgPreview.set(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    this.saving.set( true);
    const value = { ...this.form.value };
    delete value.Id;
    const v = value as unknown as Product;
    v.CategoryId = value.CategoryId!;
    v.Image = [value.Image!];
    const formData = this.logical.convertToFormData(v as any, ['Image']);
    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product Added', res);
        this.saving.set( false);
        this.store.getProducts();
        this.dialogRef.close();
      },
      error: (err) => {
        console.log('Error', err);
        this.saving.set( false);
      },
    });
  }
}
