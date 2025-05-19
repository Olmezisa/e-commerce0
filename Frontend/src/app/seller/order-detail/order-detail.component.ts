import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderResp, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order!: OrderResp;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Geçersiz sipariş ID';
      this.loading = false;
      return;
    }

    this.orderSvc.getOrderById(id).subscribe({
      next: o => {
        this.order = o;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Sipariş bulunamadı';
        this.loading = false;
      }
    });
  }

  back() {
    this.router.navigate(['/seller/order-management']);
  }
}
