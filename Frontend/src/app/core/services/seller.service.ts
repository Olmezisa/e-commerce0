import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SellerRegistrationRequest } from '../models/SellerRegistrationRequest';
import { UserResponse } from '../models/user-response.model';
import { Product, Seller } from '../../products/models/product.model';

export interface SellerDashboardDto {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  topProductName: string;
  topProductSales: number;
  avgProductPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private url=`${environment.apiUrl}/auth/register-seller`;
  private baseUrl = `${environment.apiUrl}/seller`;

  constructor(private http:HttpClient) {}

  registerSeller(data: SellerRegistrationRequest):Observable<UserResponse>{
      return this.http.post<UserResponse>(this.url,data);
    }

  getDashboard(): Observable<SellerDashboardDto> {
    return this.http.get<SellerDashboardDto>(`${this.baseUrl}/dashboard`);
  }

  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/my-products`);
  }

}
