import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = 'Usuario';

  constructor(private router: Router, public themeService: ThemeService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Mi Empresa';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}