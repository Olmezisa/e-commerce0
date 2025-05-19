import { OrderService } from './../../core/services/order.service';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userCount = 0;
  productCount = 0;
  orderCount = 0;

  constructor(private adminService: AdminService,private orderService: OrderService) {}

  ngOnInit(): void {
    this.adminService.getUserCount().subscribe({
      next: count => this.userCount = count,
      error: err => console.error('User count error:', err)
    });
    this.adminService.getProductCount().subscribe(c => this.productCount = c);
    this.orderService.getTotalOrders().subscribe(c => this.orderCount = c);
  }
}
