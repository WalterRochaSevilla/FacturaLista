import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    if (!user) {
      console.warn('No hay usuario en sesión. Redirige al login.');
      return of([]);
    }
    return this.http.get<Factura[]>(`${this.apiRealUrl}?empresaId=${user.id}`).pipe(
      catchError(() => {
        console.warn('⚠️ API de facturas inaccesible. Usando fallback local...');
    
        return this.http.get<Factura[]>('/data/facturas.json').pipe(
          map(facturas => facturas.filter(f => f.empresaId === user.id)),
          catchError(() => of([])) 
        );
      })
    );
  }
}