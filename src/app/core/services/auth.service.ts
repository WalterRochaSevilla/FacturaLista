import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  nit?: string;
  ci?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiRealUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiRealUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.warn('⚠️ Backend inaccesible. Redirigiendo a Mocks locales...');
        
        return this.http.get<User[]>('/data/users.json').pipe(
          map(users => {
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) throw new Error('Credenciales inválidas');
            return user;
          })
        );
      }),
      map(user => {
        if (user) {
          localStorage.setItem('auth_token', 'token-' + user.id);
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

  logout(): void {
    localStorage.clear();
  }
}