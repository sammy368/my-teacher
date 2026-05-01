import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface RolePagePermissions {
  teacher: string[];
  student: string[];
}

export interface PageItem {
  key: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolePermissionsService {
  private readonly storageKey = 'rolePagePermissions';
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly permissionsUrl = `${this.apiUrl}/role-permissions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    if (!token) {
      return null;
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private readonly availablePages: PageItem[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'profile', label: 'Profile' },
    { key: 'form-elements', label: 'Form Elements' },
    { key: 'basic-tables', label: 'Basic Tables' },
    { key: 'blank', label: 'Blank' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'line-chart', label: 'Line Chart' },
    { key: 'bar-chart', label: 'Bar Chart' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'avatars', label: 'Avatars' },
    { key: 'badge', label: 'Badges' },
    { key: 'buttons', label: 'Buttons' },
    { key: 'images', label: 'Images' },
    { key: 'videos', label: 'Videos' }
  ];

  getAvailablePages(): PageItem[] {
    return this.availablePages;
  }

  getPermissions(): RolePagePermissions {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return {
        teacher: this.availablePages.map((page) => page.key),
        student: this.availablePages.map((page) => page.key),
      };
    }

    try {
      const parsed = JSON.parse(stored);
      return {
        teacher: Array.isArray(parsed?.teacher) ? parsed.teacher : this.availablePages.map((page) => page.key),
        student: Array.isArray(parsed?.student) ? parsed.student : this.availablePages.map((page) => page.key),
      };
    } catch {
      return {
        teacher: this.availablePages.map((page) => page.key),
        student: this.availablePages.map((page) => page.key),
      };
    }
  }

  fetchPermissions(): Observable<RolePagePermissions> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of(this.getPermissions());
    }

    return this.http.get<RolePagePermissions>(this.permissionsUrl, { headers }).pipe(
      tap((permissions) => {
        localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      }),
      catchError(() => of(this.getPermissions()))
    );
  }

  setPermissions(permissions: RolePagePermissions): Observable<RolePagePermissions> {
    localStorage.setItem(this.storageKey, JSON.stringify(permissions));
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of(permissions);
    }

    return this.http.put<RolePagePermissions>(this.permissionsUrl, permissions, { headers }).pipe(
      tap(() => {
        localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      }),
      catchError(() => of(permissions))
    );
  }

  private normalizeRole(role: string): string {
    if (!role) {
      return '';
    }
    return role.trim().toLowerCase();
  }

  canAccess(role: string, pageKey: string): boolean {
    const normalizedRole = this.normalizeRole(role);
    if (normalizedRole === 'admin') {
      return true;
    }

    const permissions = this.getPermissions();
    if (normalizedRole === 'teacher') {
      return permissions.teacher.includes(pageKey);
    }

    if (normalizedRole === 'student') {
      return permissions.student.includes(pageKey);
    }

    return false;
  }
}
