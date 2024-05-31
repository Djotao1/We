import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { Observable, BehaviorSubject, throwError } from 'rxjs'; 
import { catchError, tap } from 'rxjs/operators'; 

import { Router } from '@angular/router';

interface RegisterRequest {
  // Your RegisterRequest interface
}

interface LoginRequest {
  // Your LoginRequest interface
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44317/api/Auth';
  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token'; // Key to store JWT token in local storage

  constructor(private http: HttpClient, private router: Router) { }

  register(user: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, user)
      .pipe(
        catchError(error => {
          console.error('Error registering user:', error);
          return throwError(error);
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token); // Store token in local storage
          this.loggedIn$.next(true);
        }),
        catchError((error: HttpErrorResponse) => { // Catch HttpErrorResponse
          if (error.status === 401) {
            // Unauthorized - wrong password
            return throwError('Incorrect password. Please try again.');
          } else {
            // Other errors
            console.error('Error logging in:', error);
            return throwError('An unexpected error occurred. Please try again later.');
          }
        })
      );
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.tokenKey); 
    localStorage.clear();// Remove token from local storage
  }

  logout(): void {
    this.clearLocalStorage();
    this.loggedIn$.next(false);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey); // Check if token exists in local storage
  }
}
