import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, Role, User } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  cartCount$: Observable<number>;
  isSeller$: Observable<boolean>;
  isBuyer$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  userRole$: Observable<Role | null>;

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.currentUser$ = this.auth.currentUser$;
    this.cartCount$ = this.cartService.cartCount$;
    this.userRole$ = this.auth.userRole$;
    this.isSeller$ = this.userRole$.pipe(map(r => r === 'SELLER'));
    this.isBuyer$ = this.userRole$.pipe(map(r => r === 'BUYER'));
    this.isAdmin$ = this.userRole$.pipe(map(r => r === 'ADMIN'));
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.auth.isLoggedInSnapshot()) {
        this.cartService['loadCount']();
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }

  goToOrders(): void {
    this.router.navigate(['orders/my-orders']);
  }

  goToAccount(): void {
    this.router.navigate(['/account/profile']);
  }

  goToOrderHistory():void{
    this.router.navigate(['/orders/order-history']);
  }

  onSearch(term: string): void {
    if (term.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: term.trim() }
      });
    }
  }
}
