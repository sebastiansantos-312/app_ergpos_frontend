import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search, BookOpen, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import  api  from '../services/api';

interface AuditRecord {
    id: number;
    eventoTipo: string;
    tablaNombre: string;
    registroId: string;
    usuarioId: string;
    detalle: string;
    createdAt: string;
}

export const AuditoriaPage: React.FC = () => {
    const [auditoria, setAuditoria] = useState<AuditRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState<string | undefined>(undefined);

    // Cargar auditoría al montar
    useEffect(() => {
        cargarAuditoria();
    }, []);

    const cargarAuditoria = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/auditoria');
            setAuditoria(data);
        } catch (error: any) {
            toast.error('Error cargando auditoría');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar registros
    const filteredAuditoria = auditoria.filter((record) => {
        const matchesSearch =
            searchTerm === '' ||
            record.tablaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.usuarioId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTipo =
            filterTipo === undefined ||
            record.eventoTipo === filterTipo;

        return matchesSearch && matchesTipo;
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Auditoría del Sistema</h1>
                    <p className="text-gray-600 mt-1">
                        Historial de cambios: <span className="font-semibold">{filteredAuditoria.length}</span> registros
                    </p>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 flex-col md:flex-row">
                            {/* Búsqueda */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por tabla o usuario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filtro de tipo */}
                            <select
                                value={filterTipo || ''}
                                onChange={(e) => setFilterTipo(e.target.value === '' ? undefined : e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                            >
                                <option value="">Todos los eventos</option>
                                <option value="INSERT">Inserción</option>
                                <option value="UPDATE">Actualización</option>
                                <option value="DELETE">Eliminación</option>
                            </select>

                            <Button onClick={cargarAuditoria} variant="outline">
                                Actualizar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Registros de Auditoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : filteredAuditoria.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No hay registros de auditoría</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold">Fecha</th>
                                            <th className="text-left p-3 font-semibold">Evento</th>
                                            <th className="text-left p-3 font-semibold">Tabla</th>
                                            <th className="text-left p-3 font-semibold">ID usuario</th>
                                            <th className="text-left p-3 font-semibold">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAuditoria.map((record, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3 text-sm">
                                                    {new Date(record.createdAt).toLocaleString('es-ES')}
                                                </td>
                                                <td className="p-3 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.eventoTipo === 'INSERT'
                                                            ? 'bg-green-100 text-green-800'
                                                            : record.eventoTipo === 'UPDATE'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {record.eventoTipo}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm font-mono">{record.tablaNombre}</td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {record.usuarioId.substring(0, 8)}...
                                                </td>
                                                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                                                    {record.detalle.substring(0, 50)}...
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};