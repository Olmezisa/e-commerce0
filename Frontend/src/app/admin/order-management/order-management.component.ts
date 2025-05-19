import { Component } from '@angular/core';
import { OrderResp, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: false,
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent {
orders: OrderResp[] = [];
  selectedOrder: OrderResp | null = null;
  loading = false;
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.orderService.getAllOrdersForAdmin().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Siparişler alınamadı.';
        this.loading = false;
      },
    });
  }

  viewDetails(order: OrderResp): void {
    this.selectedOrder = order;
  }

  cancelOrder(orderId: number): void {
    if (confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
      this.orderService.cancelOrderAsAdmin(orderId).subscribe({
        next: (updated) => {
          alert('Sipariş başarıyla iptal edildi.');
          this.fetchOrders();
          this.selectedOrder = null;
        },
        error: () => {
          alert('Siparişi iptal ederken hata oluştu.');
        },
      });
    }
  }
}
