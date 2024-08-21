import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  getCategories() {
    return this.httpClient.get<Category[]>('/categories');
  }

  getCategory(id: string) {
    return this.httpClient.get<Category>(`/categories/${id}`);
  }

  addCategory(category: Category) {
    return this.httpClient.post('/categories', category);
  }

  deleteCategory(id: string) {
    return this.httpClient.delete(`/categories/${id}`);
  }
}
