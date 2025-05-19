import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { CartItem } from '../../cart/cart-item.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = `${environment.apiUrl}/cart`;
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.currentUser$.subscribe(user => {
      if (user) this.loadCount();
      else    this.cartCountSubject.next(0);
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.auth.isLoggedInSnapshot()) this.loadCount();
      });
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.api);
  }

  addToCart(
    productId: number,
    quantity: number,
    variantId?: number,
  ): Observable<void> {

    if(!this.auth.isAuthenticated()||this.auth.userRole !=='BUYER'){
      this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    return EMPTY;
    }
    let params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity',  quantity.toString());
    if (variantId != null) params = params.set('variantId', variantId.toString());

    return this.http
      .post<void>(`${this.api}/add`, null, { params })
      .pipe(tap(() => this.loadCount()));
  }

  removeFromCart(
    productId: number,
    variantId?: number
  ): Observable<void> {
    let params = new HttpParams().set('productId', productId.toString());
    if (variantId != null) params = params.set('variantId', variantId.toString());

    return this.http
      .delete<void>(`${this.api}/remove`, { params })
      .pipe(tap(() => this.loadCount()));
  }

  clearCart(): Observable<void> {
    return this.http
      .delete<void>(`${this.api}/clear`)
      .pipe(tap(() => this.cartCountSubject.next(0)));
  }

  private loadCount(): void {
    this.getCart().subscribe(items => {
      const total = items.reduce((sum, i) => sum + i.quantity, 0);
      this.cartCountSubject.next(total);
    });
  }
}
