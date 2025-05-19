import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { OrderResp, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-tracking',
  standalone:false,
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit {
  order!: OrderResp;
  shipmentSteps = ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'];
  currentStep = 0;
  loading = true;
  error = '';

  isSeller = false;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.auth.currentUser$.subscribe((user: User | null) => {
      this.isSeller = user?.role === 'SELLER';
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const orderId = idParam ? +idParam : null;
    if (orderId == null || isNaN(orderId)) {
      this.error = 'Geçersiz sipariş ID';
      this.loading = false;
      return;
    }

    this.orderService.getOrderById(orderId).subscribe({
      next: resp => {
        this.order = resp;
        this.currentStep = this.shipmentSteps.indexOf(resp.shipmentStatus || 'PENDING');
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Sipariş bulunamadı';
        this.loading = false;
      }
    });
  }


  markShipped(): void {
    if (!this.isSeller) return;
    if (!confirm('Bu siparişi kargoya vermek istediğinize emin misiniz?')) return;
    this.orderService.updateShipmentStatus(this.order.orderId, 'SHIPPED')
      .subscribe({
        next: updated => {
          this.order = updated;
          this.currentStep = this.shipmentSteps.indexOf(updated.shipmentStatus || 'PENDING');
        },
        error: err => alert('Durum güncellenemedi: ' + err.message)
      });
  }
}
