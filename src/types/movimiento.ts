export interface MovimientoInventarioRequestDTO {
    codigoProducto: string;
    cantidad: number;
    tipo: 'ENTRADA' | 'SALIDA';
    proveedor?: string;
    observacion?: string;
}

export interface MovimientoInventarioResponseDTO {
    codigoProducto: string;
    nombreProducto: string;
    cantidad: number;
    tipo: string;
    proveedor?: string;
    observacion?: string;
}
