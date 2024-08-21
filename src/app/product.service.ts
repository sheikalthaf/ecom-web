import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getProducts() {
    return this.httpClient.get<Product[]>('/products');
  }

  getProduct(id: string) {
    return this.httpClient.get<Product>(`/products/${id}`);
  }

  addProduct(product: Product) {
    return this.httpClient.post('/products', product);
  }

  deleteProduct(id: string) {
    return this.httpClient.delete(`/products/${id}`);
  }
}
