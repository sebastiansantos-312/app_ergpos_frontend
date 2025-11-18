// src/types/transformBackendUser.ts
import type { User } from "./index";

export const transformBackendUser = (backendData: any): User => {
    return {
        id: backendData.id || backendData.codigo || '',
        codigo: backendData.codigo || '',
        email: backendData.email || '',
        nombre: backendData.nombre || '',
        departamento: backendData.departamento || '',
        puesto: backendData.puesto || '',
        roles: Array.isArray(backendData.roles) ? backendData.roles : [],
        activo: backendData.activo !== undefined ? backendData.activo : true,
        createdAt: backendData.createdAt || new Date().toISOString(),
        updatedAt: backendData.updatedAt || new Date().toISOString()
    };
};
