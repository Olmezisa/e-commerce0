import { Component, OnInit } from '@angular/core';
import { OrderResp, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
pastOrders: OrderResp[] = [];
  loading = true;
  error = '';

  constructor(private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.orderSvc.getBuyerOrders().subscribe({
      next: orders => {
        this.pastOrders = orders.filter(o =>
          o.shipmentStatus === 'DELIVERED' || o.shipmentStatus=== 'CANCELED');
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Geçmiş siparişler yüklenemedi';
        this.loading = false;
      }
    });
  }
}
