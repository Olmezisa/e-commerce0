import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResp, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone:false,
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: OrderResp[] = [];
  loading = true;
  error = '';

  // possible shipment steps in order
  shipmentSteps = ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'];

  constructor(
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.loading = true;
    this.error = '';
    this.orderSvc.getSellerOrders().subscribe({
      next: data => {
        this.orders = data.filter(o=>!!o.shipmentStatus);
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Satışlar yüklenemedi';
        this.loading = false;
      }
    });
  }

  onCancel(o: OrderResp) {
    if (!confirm(`Sipariş #${o.orderId} iptal edilsin mi?`)) return;
    this.orderSvc.cancelOrder(o.orderId).subscribe({
      next: () => this.loadOrders(),
      error: err => alert('İptal sırasında hata: ' + (err.message || err.statusText))
    });
  }


  trackOrder(o: OrderResp) {
    this.router.navigate(['/orders/order-tracking', o.orderId]);
  }

  // update to next shipment status
  advanceShipment(o: OrderResp) {
    const currentIndex = this.shipmentSteps.indexOf(o.shipmentStatus || 'PENDING');
    if (currentIndex < 0 || currentIndex >= this.shipmentSteps.length - 1) return;
    const nextStatus = this.shipmentSteps[currentIndex + 1];
    if (!confirm(`Sipariş #${o.orderId} durumunu '${nextStatus}' olarak güncellemek istediğinize emin misiniz?`)) return;

    this.orderSvc.updateShipmentStatus(o.orderId, nextStatus).subscribe({
      next: () => this.loadOrders(),
      error: err => alert('Durum güncellenemedi: ' + (err.message || err.statusText))
    });
  }
}
