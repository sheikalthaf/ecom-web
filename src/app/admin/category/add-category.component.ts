import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LogicalService } from '../logical.service';
import { FileValueAccessor } from '../../shared/file-value.directive';
import { CategoryService } from '../../category.service';
import { Category } from '../../models/category';
import { AppState } from '../../store/product.store';
import { Button, DialogRef, Input, Label, Spinner } from '@meeui/ui';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileValueAccessor,
    Spinner,
    Button,
    Input,
    Label,
  ],
  selector: 'az-add-category',
  template: `<div>
    <div class="sm:max-w-[425px] max-h-[80vh] overflow-auto">
      <div class="grid gap-4 py-4" [formGroup]="form">
        <label meeLabel
          >Name
          <input
            class="w-80"
            meeInput
            type="text"
            placeholder="Name"
            formControlName="Name"
          />
        </label>
        <label meeLabel
          >Description
          <textarea
            class="w-80 min-h-[8rem]"
            meeInput
            type="text"
            placeholder="Description"
            formControlName="Description"
          ></textarea>
        </label>
      </div>
      <div>
        <button
          meeButton
          type="submit"
          [disabled]="form.invalid"
          (click)="addCategory()"
        >
          @if (saving) {
          <mee-spinner />
          Saving... } @else { Save changes }
        </button>
      </div>
    </div>
  </div>`,
})
export class AddCategoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(CategoryService);
  private logical = inject(LogicalService);
  private store = inject(AppState);
  private dialogRef = inject(DialogRef);

  form = this.fb.nonNullable.group({
    Id: [''],
    Name: ['', Validators.required],
    Description: [''],
    IsDeleted: [false],
  });

  imgPreview: string;
  saving: boolean;

  constructor() {}

  ngOnInit() {}

  addCategory() {
    this.saving = true;
    const value = { ...this.form.value } as Category;
    delete value.Id;
    const formData = this.logical.convertToFormData(value as any, ['Image']);
    this.productService.addCategory(formData).subscribe((res) => {
      console.log('Product Added', res);
      this.saving = false;
      this.store.getCategories();
      this.dialogRef.close();
    });
  }
}
