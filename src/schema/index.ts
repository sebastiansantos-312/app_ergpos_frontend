import { z } from 'zod';

// ============ AUTH SCHEMAS ============
export const loginSchema = z.object({
    username: z.string().min(1, 'El usuario es obligatorio'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const cambiarPasswordSchema = z.object({
    passwordActual: z.string().min(1, 'La contraseña actual es obligatoria'),
    nuevoPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmarPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine((data) => data.nuevoPassword === data.confirmarPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarPassword'],
});

// ============ USUARIO SCHEMAS ============
export const usuarioCreateSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    codigo: z.string().optional(),
    nombreRol: z.string().min(1, 'El rol es obligatorio'),
});

export const usuarioUpdateSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
    codigo: z.string().optional(),
    nombreRol: z.string().min(1, 'El rol es obligatorio'),
});

// ============ ROL SCHEMAS ============
export const rolSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
});

// ============ PRODUCTO SCHEMAS ============

export const productoSchema = z.object({
    codigo: z.string()
        .min(1, 'El código es obligatorio')
        .max(50, 'Máximo 50 caracteres'),
    nombre: z.string()
        .min(1, 'El nombre es obligatorio')
        .max(255, 'Máximo 255 caracteres'),
    descripcion: z.string()
        .max(255, 'Máximo 255 caracteres')
        .optional()
        .nullable()
        .transform(val => val === '' ? null : val),
    codigoCategoria: z.string()
        .optional()
        .nullable()
        .transform(val => val === '' ? undefined : val),
    precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
    stockMinimo: z.number().min(0, 'El stock mínimo no puede ser negativo').default(0),
    stockActual: z.number().min(0, 'El stock actual no puede ser negativo').default(0),
    unidadMedida: z.string()
        .max(20, 'Máximo 20 caracteres')
        .default('UNIDAD'),
});
// Tipo inferido del schema

// ============ CATEGORIA SCHEMAS ============
export const categoriaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    codigo: z.string().max(50, 'Máximo 50 caracteres').optional(),
});

// ============ PROVEEDOR SCHEMAS ============
export const proveedorSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
    ruc: z.string().max(20, 'Máximo 20 caracteres').optional(),
    telefono: z.string().max(20, 'Máximo 20 caracteres').optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    direccion: z.string().optional(),
});

// ============ MOVIMIENTO SCHEMAS ============
export const movimientoSchema = z.object({
    codigoProducto: z.string().min(1, 'El producto es obligatorio'),
    cantidad: z.number()
        .min(1, 'La cantidad debe ser mayor a 0'),
    tipo: z.enum(['ENTRADA', 'SALIDA']),
    codigoUsuario: z.string().min(1, 'El usuario es obligatorio'),
    rucProveedor: z.string().optional(),
    observacion: z.string().optional(),
    documentoRef: z.string().optional(),
    costoUnitario: z.number()
        .min(0, 'El costo debe ser mayor o igual a 0')
        .optional(),
    estado: z.enum(['ACTIVO', 'PENDIENTE', 'ANULADO']).optional(),
});


// ============ TYPES ============
export type LoginFormData = z.infer<typeof loginSchema>;
export type CambiarPasswordFormData = z.infer<typeof cambiarPasswordSchema>;
export type UsuarioCreateFormData = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdateFormData = z.infer<typeof usuarioUpdateSchema>;
export type ProductoFormData = z.infer<typeof productoSchema>;
export type CategoriaFormData = z.infer<typeof categoriaSchema>;
export type ProveedorFormData = z.infer<typeof proveedorSchema>;
export type RolFormData = z.infer<typeof rolSchema>;
export type MovimientoFormData = z.infer<typeof movimientoSchema>;