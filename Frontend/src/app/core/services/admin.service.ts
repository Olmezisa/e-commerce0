import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse } from '../models/user-response.model';


@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/users/count`);
  }


  getProductCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/products/count`);
  }

  getOrderCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/orders/count`);
  }
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.api}/users/all`);
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/users/admin/${id}`);
  }
  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${this.api}/users/admin/${id}/toggle-status`, {});
  }


}
