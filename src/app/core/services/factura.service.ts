import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Factura, ResumenIVA } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  getFacturas(): Observable<Factura[]> {
    if (localStorage.getItem('user_type') === 'new') {
      return of([]);
    }
    const empresaId = localStorage.getItem('empresa_id');
    return this.http.get<Factura[]>('/data/facturas.json').pipe(
      map(facturas => facturas.filter(f => f.empresaId === empresaId))
    );
  }

  getResumenIVA(): Observable<ResumenIVA> {
    if (localStorage.getItem('user_type') === 'new') {
      return of({ debito: 0, credito: 0, saldo: 0 });
    }
    return this.http.get<ResumenIVA>('/data/resumen.json');
  }
}