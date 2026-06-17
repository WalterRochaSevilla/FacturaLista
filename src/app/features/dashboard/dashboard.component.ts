import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FacturaService } from '../../core/services/factura.service';
import { Factura } from '../../core/models/factura.model';
import { UploadModalComponent } from '../../shared/components/upload-modal/upload-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, UploadModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  facturas: Factura[] = [];
  searchQuery: string = '';
  debitoTotal: number = 0;
  creditoTotal: number = 0;
  saldoTotal: number = 0;
  isUploadModalOpen = false;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }
  cargarFacturas() {
    this.isLoading = true;
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.isLoading = false;
        this.calcularImpuestos();
      }, 
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        this.isLoading = false;
      }
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

  onModalClose(success: boolean) {
    this.isUploadModalOpen = false;
    
    if (success) {
      // If the uploaded invoice was added, refresh with a wide range
      const inicio = '2000-01-01';
      const fin = new Date().toISOString();
      this.isLoading = true;
      this.facturaService.getFacturasRange(inicio, fin).subscribe({
        next: (data) => {
          this.facturas = data;
          this.isLoading = false;
          this.calcularImpuestos();
        },
        error: (err) => {
          console.error('Error al recargar facturas tras registro:', err);
          this.isLoading = false;
        }
      });
    }
  }

  onDeleteFactura(id?: string) {
    if (!id) {
      alert('Factura inválida: id no disponible.');
      return;
    }
    if (!confirm('¿Eliminar factura? Esta acción no se puede deshacer.')) return;
    this.isLoading = true;
    this.facturaService.deleteFactura(id).subscribe({
      next: () => {
        // remove from local list
        this.facturas = this.facturas.filter(f => f.id !== id);
        this.isLoading = false;
        this.calcularImpuestos();
      },
      error: (err) => {
        console.error('Error al eliminar factura:', err);
        this.isLoading = false;
      }
    });
  }
  exportarTXT() {
    if (this.facturas.length === 0) {
      alert('No hay facturas para exportar.');
      return;
    }
    let contenidoTXT = '';
    this.facturas.forEach((f, index) => {
      const linea = `1|${index + 1}|${f.fechaEmision}|${f.nitEmisor}|${f.razonSocialEmisor}|${f.numeroFactura}||${f.importeTotal}|0|0|0|0|${f.importeBaseCreditoFiscal}|13.0|0`;
      contenidoTXT += linea + '\n';
    });
    const blob = new Blob([contenidoTXT], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LCV_SIAT_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}