import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura, ResumenIVA } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>('/data/facturas.json');
  }

  getResumenIVA(): Observable<ResumenIVA> {
    return this.http.get<ResumenIVA>('/data/resumen.json');
  }
}