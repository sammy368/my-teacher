import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { RolePermissionsService } from './role-permissions.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);
  private rolePermissionsService = inject(RolePermissionsService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(childRoute, state);
  }

  private checkAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      return false;
    }

    const userRole = this.authService.getUserRole();
    if (!userRole) {
      this.router.navigate(['/signin']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[] | undefined;
    if (allowedRoles) {
      const normalizedAllowed = allowedRoles.map((role) => role.trim().toLowerCase());
      if (!normalizedAllowed.includes(userRole.toLowerCase())) {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    const pageKey = route.data['pageKey'] as string | undefined;
    if (pageKey && !this.rolePermissionsService.canAccess(userRole, pageKey)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
