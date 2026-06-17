import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  nit?: string;
  ci?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiRealUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiRealUrl}/login`, { email, password }).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('auth_token', user.token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        return user;
      })
    );
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.clear();
  }
}