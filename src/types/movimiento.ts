export interface MovimientoInventarioRequest {
    codigoProducto: string;   
    cantidad: number;        
    tipo: string;             
    codigoUsuario: string;    
    rucProveedor?: string;   
    observacion?: string;     
    documentoRef?: string;   
    costoUnitario?: number;  
    estado?: string;          
}

export interface MovimientoInventarioResponse {
    id: string;
    codigoProducto: string;
    nombreProducto: string;
    cantidad: number;
    tipo: string;
    proveedorNombre?: string;
    usuarioNombre: string;
    observacion?: string;
    documentoRef?: string;
    costoUnitario?: number;
    fecha: string;
    estado: string;
    createdAt: string;
}