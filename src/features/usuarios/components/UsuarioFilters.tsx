import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UsuarioFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterActivo: boolean | undefined;
    onFilterChange: (value: boolean | undefined) => void;
}

export const UsuarioFilters: React.FC<UsuarioFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterActivo,
    onFilterChange,
}) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex gap-4 flex-col md:flex-row">
                    {/* Búsqueda */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, email o código..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filtro de estado */}
                    <select
                        value={filterActivo === undefined ? '' : filterActivo.toString()}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                onFilterChange(undefined);
                            } else {
                                onFilterChange(e.target.value === 'true');
                            }
                        }}
                        className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                    >
                        <option value="">Todos los estados</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    );
};
