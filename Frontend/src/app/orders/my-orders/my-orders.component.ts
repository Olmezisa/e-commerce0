import { Component, OnInit } from '@angular/core';
import { OrderItem, OrderResp, OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: OrderResp[] = [];
  loading = true;
  error = '';
  baseImageUrl = 'http://localhost:8080';

  constructor(private orderSvc: OrderService,private router: Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderSvc.getBuyerOrders().subscribe({
      next: data => {
        this.orders = data.filter(o =>
          o.status !== 'CANCELLED' && o.shipmentStatus !== 'DELIVERED'
        );
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Siparişler yüklenemedi';
        this.loading = false;
      }
    });
  }

  onCancel(order: OrderResp) {
    if (!confirm(`Does the order #${order.orderId} should be cancelled?`)) {
      return;
    }

    this.orderSvc.cancelOrder(order.orderId)
      .subscribe({
        next: () => {
          alert(`Order #${order.orderId} cancelled succesfully.`);
          this.loadOrders();    // listeyi yenile
        },
        error: err => {
          alert('İptal sırasında hata: ' + (err.error?.message || err.statusText));
        }
      });
  }

  onCancelItem(order: OrderResp, item: OrderItem): void {
    if (!confirm(`${item.productName} ıptal edilsin mi?`)) return;
    this.orderSvc.cancelItem(order.orderId, item.itemId).subscribe({
      next: () => this.loadOrders(),
      error: err => alert('Hata: ' + (err.error?.message || err.statusText))
    });
  }
   trackOrder(o: OrderResp): void {
    this.router.navigate(['/orders/order-tracking', o.orderId]);
  }
}
