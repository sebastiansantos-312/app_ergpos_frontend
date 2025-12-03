import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MovimientoFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterTipo: string | undefined;
    onFilterTipoChange: (value: string | undefined) => void;
    filterEstado: string | undefined;
    onFilterEstadoChange: (value: string | undefined) => void;
}

export const MovimientoFilters: React.FC<MovimientoFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterTipo,
    onFilterTipoChange,
    filterEstado,
    onFilterEstadoChange,
}) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex gap-4 flex-col md:flex-row">
                        {/* Búsqueda */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por producto o usuario..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtro de tipo */}
                        <select
                            value={filterTipo || ''}
                            onChange={(e) => onFilterTipoChange(e.target.value === '' ? undefined : e.target.value)}
                            className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="ENTRADA">Entrada</option>
                            <option value="SALIDA">Salida</option>
                        </select>

                        {/* Filtro de estado */}
                        <select
                            value={filterEstado || ''}
                            onChange={(e) => onFilterEstadoChange(e.target.value === '' ? undefined : e.target.value)}
                            className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                        >
                            <option value="">Todos los estados</option>
                            <option value="ACTIVO">Activo</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="ANULADO">Anulado</option>
                        </select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
