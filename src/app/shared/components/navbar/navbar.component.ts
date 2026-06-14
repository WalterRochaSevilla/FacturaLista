import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = 'Usuario';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Mi Empresa';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}