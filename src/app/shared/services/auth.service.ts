import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SignInRequest {
  email: string;
  password: string;
  role?: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  user?: any;
}

export interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signin`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  signUp(userData: SignUpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Auth API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Store token in localStorage (you might want to use a more secure method)
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private normalizeRole(role: string): string {
    if (!role) {
      return role;
    }
    const normalized = role.trim().toLowerCase();
    if (normalized === 'admin') {
      return 'Admin';
    }
    if (normalized === 'teacher') {
      return 'Teacher';
    }
    if (normalized === 'student') {
      return 'Student';
    }
    return role;
  }

  setUserData(user: any): void {
    if (user === null) {
      localStorage.removeItem('user');
      return;
    }

    if (user.role) {
      user.role = this.normalizeRole(user.role);
    }

    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserData(): UserData | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getUserData();
    if (!user?.role) {
      return null;
    }
    return this.normalizeRole(user.role);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
    this.setUserData(null);
    this.router.navigate(['/']);
  }
}