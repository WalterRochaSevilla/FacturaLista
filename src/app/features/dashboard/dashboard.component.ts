import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FacturaService } from '../../core/services/factura.service';
import { Factura, ResumenIVA } from '../../core/models/factura.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  facturas: Factura[] = [];
  resumen: ResumenIVA | null = null;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.facturaService.getFacturas().subscribe(data => this.facturas = data);
    this.facturaService.getResumenIVA().subscribe(data => this.resumen = data);
  }
}