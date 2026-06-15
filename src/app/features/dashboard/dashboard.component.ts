import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FacturaService } from '../../core/services/factura.service';
import { Factura } from '../../core/models/factura.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  facturas: Factura[] = [];
  searchQuery: string = '';
  debitoTotal: number = 0;
  creditoTotal: number = 0;
  saldoTotal: number = 0;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.facturaService.getFacturas().subscribe(data => {
      this.facturas = data;
      this.calcularImpuestos();
    });
  }

  get filteredFacturas() {
    if (!this.searchQuery) return this.facturas;
    
    const query = this.searchQuery.toLowerCase();
    return this.facturas.filter(f => 
      f.nitEmisor.includes(query) || 
      f.razonSocialEmisor.toLowerCase().includes(query) ||
      f.numeroFactura.includes(query)
    );
  }

  calcularImpuestos() {
    let baseVentas = 0;
    let baseCompras = 0;

    this.facturas.forEach(f => {
      if (f.tipo === 'venta') baseVentas += f.importeBaseCreditoFiscal;
      if (f.tipo === 'compra') baseCompras += f.importeBaseCreditoFiscal;
    });

    this.debitoTotal = baseVentas * 0.13;
    this.creditoTotal = baseCompras * 0.13;
    this.saldoTotal = this.debitoTotal - this.creditoTotal;
  }
}