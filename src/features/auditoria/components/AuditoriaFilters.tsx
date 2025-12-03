import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AuditoriaFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterTipo: string | undefined;
    onFilterChange: (value: string | undefined) => void;
    onRefresh: () => void;
}

export const AuditoriaFilters: React.FC<AuditoriaFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterTipo,
    onFilterChange,
    onRefresh,
}) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex gap-4 flex-col md:flex-row">
                    {/* Búsqueda */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por tabla, usuario o ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filtro de tipo */}
                    <select
                        value={filterTipo || ''}
                        onChange={(e) => onFilterChange(e.target.value === '' ? undefined : e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                    >
                        <option value="">Todos los eventos</option>
                        <option value="INSERT">Inserción</option>
                        <option value="UPDATE">Actualización</option>
                        <option value="DELETE">Eliminación</option>
                        <option value="LOGIN">Inicio de sesión</option>
                        <option value="LOGOUT">Cierre de sesión</option>
                    </select>

                    <Button onClick={onRefresh} variant="outline">
                        Actualizar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
