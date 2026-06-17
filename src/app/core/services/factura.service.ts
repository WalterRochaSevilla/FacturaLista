import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Factura {
  empresaId: string;
  tipo: 'compra' | 'venta';
  nitEmisor: string;
  razonSocialEmisor: string;
  numeroFactura: string;
  fechaEmision: string;
  nitComprador: string;
  importeTotal: number;
  descuentos: number;
  importeBaseCreditoFiscal: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiRealUrl = 'http://localhost:3000/api/facturas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFacturas(): Observable<Factura[]> {
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    if (!user || !token) {
      console.warn('No hay usuario en sesión o token inválido. Redirige al login.');
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Factura[]>(this.apiRealUrl, { headers }).pipe(
      catchError((err) => {
        console.warn('⚠️ API de facturas inaccesible.', err?.message ?? err);
        return of([]);
      })
    );
  }
}