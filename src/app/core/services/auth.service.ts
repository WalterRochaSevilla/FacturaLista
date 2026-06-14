import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>('/data/users.json').pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('auth_token', 'mock-token-' + user.id);
          localStorage.setItem('user_name', user.name);
          localStorage.setItem('empresa_id', user.id);
          localStorage.setItem('user_type', 'existing');
          return user;
        }
        return null;
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }
}