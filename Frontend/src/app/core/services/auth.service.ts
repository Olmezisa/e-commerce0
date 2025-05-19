import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export type Role = 'ADMIN' | 'SELLER' | 'BUYER';

export interface User {
  fullName?: string;
  email: string;
  password?: string;
  role?: Role;
  city?: string;
  token?: string;
  provider?: 'google' | 'facebook';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(u => !!u));
  public userRole$: Observable<Role | null> = this.currentUser$.pipe(map(u => u?.role ?? null));
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        this.currentUserSubject.next(JSON.parse(saved));
      }
    }
  }

  public get userRole(): Role | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => this.setCurrentUser(user)),
      catchError((err) => {
        console.error('Login error:', err);
        return of(null);
      })
    );
  }

  register(user: Partial<User>): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap((registeredUser) => {
        if (registeredUser && registeredUser.email) {
          this.setCurrentUser(registeredUser);
        }
      }),
      catchError((err) => {
        console.error('Register error:', err);
        return of(null);
      })
    );
  }
  logout(): void {
    this.currentUserSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/home']);
  }

  public isLoggedInSnapshot(): boolean {
    return !!this.currentUserSubject.value;
  }

  public getCurrentUser(): Observable<User | null> {
  return this.currentUser$;
}


  updateCurrentUser(data: Partial<Omit<User, 'email' | 'password' | 'provider'>>): void {
    const user = this.currentUserSubject.value;
    if (!user) return;
    const updated = { ...user, ...data };
    this.setCurrentUser(updated);
  }

  socialLogin(provider: 'google' | 'facebook', token: string): Observable<User> {
    const user: User = {
      email: `${provider}@social`,
      provider,
      token,
      role: 'BUYER'
    };
    this.setCurrentUser(user);
    return of(user);
  }

  private setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
  public isAuthenticated(): boolean {
  return !!this.currentUserSubject.value?.token;
}


}
