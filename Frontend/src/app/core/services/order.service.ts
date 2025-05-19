
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentCreateResp {
  clientSecret: string;
  paymentIntentId: string;
}

export interface OrderItemReq {
  productId: number;
  quantity: number;
}
export interface OrderItem {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
  status:string;
}

export interface ConfirmOrderReq {
  paymentIntentId: string;
  items: OrderItemReq[];
}

export interface OrderResp {
  orderId: number;
  status: string;
  shipmentStatus?: string;
  totalAmount?: number;
  currency?: string;
  createdAt: Date;
  items?: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createPayment(amount: number): Observable<PaymentCreateResp> {
    return this.http.post<PaymentCreateResp>(
      `${environment.apiUrl}/payments/create?amount=${amount}`, {}
    );
  }

  confirmOrder(req: ConfirmOrderReq): Observable<OrderResp> {

    return this.http.post<OrderResp>(`${this.base}/create`, req);
  }

  getBuyerOrders(): Observable<OrderResp[]> {
    return this.http.get<OrderResp[]>(`${this.base}/my`);
  }

  cancelOrder(orderId: number): Observable<OrderResp> {
  return this.http.post<OrderResp>(
    `${this.base}/${orderId}/cancel`, {}
  );
  }

  getSellerOrders(): Observable<OrderResp[]> {
    return this.http.get<OrderResp[]>(`${this.base}/seller`);
  }

   getOrderById(orderId: number): Observable<OrderResp> {
    return this.http.get<OrderResp>(`${this.base}/${orderId}`);
  }


  updateShipmentStatus(orderId: number, shipmentStatus: string): Observable<OrderResp> {
    return this.http.put<OrderResp>(
      `${this.base}/${orderId}/shipment`,
      { shipmentStatus }
    );
  }

  getTotalOrders(): Observable<number> {
  return this.http.get<number>(`${environment.apiUrl}/orders/count`);
}
cancelItem(orderId: number, itemId: number): Observable<void> {
  return this.http.post<void>(
    `${this.base}/${orderId}/items/${itemId}/cancel`, {}
  );
}
getAllOrdersForAdmin(): Observable<OrderResp[]> {
  return this.http.get<OrderResp[]>(`${this.base}/admin`);
}


cancelOrderAsAdmin(orderId: number): Observable<OrderResp> {
  return this.http.post<OrderResp>(`${this.base}/${orderId}/admin-cancel`, {});
}

}
