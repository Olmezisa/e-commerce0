import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Product } from '../../products/models/product.model';
import { environment } from '../../environments/environment';
import { ProductVariant } from '../../products/models/variant.model';
import { VariantRequest } from '../../products/models/variant-request.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  // --- Ürün metodları ---
  getProducts(status?: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      status ? `${this.apiUrl}?status=${status}` : this.apiUrl
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(product => console.log('✅ Ürün verisi geldi:', product)),
      catchError(err => {
        console.error('❌ Ürün getirme hatası:', err);
        return throwError(() => err);
      })
    );
  }

  addProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  updateProduct(id: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  approveProduct(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectProduct(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/reject`, {});
  }

  unbanProduct(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/unban`, {});
  }

  getVariants(productId: number): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(
      `${environment.apiUrl}/products/${productId}/variants`
    ).pipe(
      tap(vars => console.log(`✅ ${productId} için varyantlar:`, vars)),
      catchError(err => {
        console.error(`❌ Varyant çekme hatası (Ürün ID: ${productId}):`, err);
        return throwError(() => err);
      })
    );
  }

  createVariant(
    productId: number,
    dto: VariantRequest
  ): Observable<ProductVariant> {
    return this.http.post<ProductVariant>(
      `${environment.apiUrl}/products/${productId}/variants`,
      dto
    );
  }

  updateVariant(
    variantId: number,
    dto: VariantRequest
  ): Observable<ProductVariant> {
    return this.http.put<ProductVariant>(
      `${environment.apiUrl}/products/variants/${variantId}`,
      dto
    );
  }

  deleteVariant(variantId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/variants/${variantId}`);
  }

  getProductsByCategory(id: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/category/${id}`);
}

}
