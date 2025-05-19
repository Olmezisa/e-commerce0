import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  let authReq = req;

  if (isPlatformBrowser(this.platformId)) {
    const raw = localStorage.getItem('currentUser');
    let token: string | null = null;

    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.token && typeof parsed.token === 'string' && parsed.token.length > 0) {
        token = parsed.token;
      }
    } catch {
      token = null;
    }

    console.log(`>> HTTP ${req.method} ${req.urlWithParams} — token:`, token);

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next.handle(authReq);
}

}
