import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault();
    localStorage.setItem('auth_token', 'mock-token-123');
    localStorage.setItem('user_name', 'Cochatech SRL');
    this.router.navigate(['/dashboard']);
  }
}