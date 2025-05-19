import { Injectable } from '@angular/core';

import {CanActivate,ActivatedRouteSnapshot,Router} from '@angular/router';
import { AuthService, Role } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Role[];

    const currentRole = this.auth.userRole;

    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
