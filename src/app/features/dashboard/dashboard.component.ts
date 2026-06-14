import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FacturaService } from '../../core/services/factura.service';
import { Factura, ResumenIVA } from '../../core/models/factura.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  facturas: Factura[] = [];
  resumen: ResumenIVA | null = null;
  userName: string = 'Usuario';

  constructor(
    private facturaService: FacturaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Mi Empresa';
    this.facturaService.getFacturas().subscribe(data => this.facturas = data);
    this.facturaService.getResumenIVA().subscribe(data => this.resumen = data);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    this.router.navigate(['/']);
  }
}