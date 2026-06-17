export type TipoFactura = 'compra' | 'venta';

export interface Factura {
    id?: string;
    empresaId: string;
    tipo: TipoFactura;
    nitEmisor: string;
    razonSocialEmisor: string;
    numeroFactura: string;
    numeroAutorizacion?: string;
    fechaEmision: string;
    nitComprador: string;
    importeTotal: number;
    descuentos: number;
    importeBaseCreditoFiscal: number;
}

export interface ResumenIVA {
    debito: number;
    credito: number;
    saldo: number;
}