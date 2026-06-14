import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router: Router) {}

  onRegister(event: Event) {
    event.preventDefault();
    localStorage.setItem('auth_token', 'mock-token-nuevo-usuario');
    localStorage.setItem('user_name', 'Nueva Empresa SRL');
    
    this.router.navigate(['/dashboard']);
  }
}