// rolService.ts - CORREGIDO
import api from './api';
import type { Rol } from '../types';

// Para crear rol necesitamos definir el request
interface RolRequest {
    nombre: string;
}

export const rolService = {
    listarActivos: (): Promise<Rol[]> =>
        api.get('/roles').then(res => res.data),

    listarInactivos: (): Promise<Rol[]> =>
        api.get('/roles/inactivos').then(res => res.data),

    crearRol: (rol: RolRequest): Promise<Rol> =>
        api.post('/roles', rol).then(res => res.data),

    activarRol: (nombre: string): Promise<Rol> =>
        api.put(`/roles/${nombre}/activar`).then(res => res.data),

    desactivarRol: (nombre: string): Promise<Rol> =>
        api.put(`/roles/${nombre}/desactivar`).then(res => res.data),
};