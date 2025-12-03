import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export interface AuditRecord {
    id: number;
    eventoTipo: string;
    tablaNombre: string;
    registroId: string;
    usuarioId: string;
    detalle: string;
    createdAt: string;
}

interface AuditoriaTableProps {
    auditoria: AuditRecord[];
    isLoading: boolean;
    expandedRows: Set<number>;
    onToggleExpand: (id: number) => void;
    onViewDetalle: (detalle: string) => void;
}

const getDetallePreview = (detalle: string) => {
    const safeDetalle = detalle || '{}';

    try {
        const parsed = JSON.parse(safeDetalle);
        const keys = Object.keys(parsed);

        if (keys.length === 0) {
            return <span className="text-gray-400 italic">Sin detalles</span>;
        }

        return (
            <div className="text-xs">
                <span className="font-medium">{keys.length} campo(s):</span>
                <span className="ml-2 text-gray-600">
                    {keys.slice(0, 2).join(', ')}
                    {keys.length > 2 ? `... (+${keys.length - 2})` : ''}
                </span>
            </div>
        );
    } catch (error) {
        return <span className="text-red-500 text-xs">JSON inválido</span>;
    }
};

export const AuditoriaTable: React.FC<AuditoriaTableProps> = ({
    auditoria,
    isLoading,
    expandedRows,
    onToggleExpand,
    onViewDetalle,
}) => {
    return (
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
                ) : auditoria.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay registros de auditoría</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3 font-semibold text-sm">Fecha</th>
                                    <th className="text-left p-3 font-semibold text-sm">Evento</th>
                                    <th className="text-left p-3 font-semibold text-sm">Tabla</th>
                                    <th className="text-left p-3 font-semibold text-sm">Usuario ID</th>
                                    <th className="text-left p-3 font-semibold text-sm">Registro ID</th>
                                    <th className="text-left p-3 font-semibold text-sm">Detalle</th>
                                    <th className="text-left p-3 font-semibold text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditoria.map((record) => (
                                    <React.Fragment key={record.id}>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-sm">
                                                {new Date(record.createdAt).toLocaleString('es-ES')}
                                            </td>
                                            <td className="p-3 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${record.eventoTipo === 'INSERT'
                                                    ? 'bg-green-100 text-green-800'
                                                    : record.eventoTipo === 'UPDATE'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : record.eventoTipo === 'DELETE'
                                                            ? 'bg-red-100 text-red-800'
                                                            : record.eventoTipo === 'LOGIN'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {record.eventoTipo}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm font-mono text-gray-800">
                                                {record.tablaNombre}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600 font-mono">
                                                {record.usuarioId.substring(0, 8)}...
                                            </td>
                                            <td className="p-3 text-sm text-gray-600 font-mono">
                                                {record.registroId.substring(0, 8)}...
                                            </td>
                                            <td className="p-3 text-sm">
                                                {getDetallePreview(record.detalle)}
                                            </td>
                                            <td className="p-3 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onViewDetalle(record.detalle)}
                                                        className="h-8 px-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onToggleExpand(record.id)}
                                                        className="h-8 px-2"
                                                    >
                                                        {expandedRows.has(record.id) ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(record.id) && (
                                            <tr className="border-b bg-gray-50">
                                                <td colSpan={7} className="p-4">
                                                    <div className="bg-white p-4 rounded-lg border">
                                                        <h4 className="font-medium mb-2">Detalles completos:</h4>
                                                        <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                                                            {JSON.stringify(JSON.parse(record.detalle || '{}'), null, 2)}
                                                        </pre>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
