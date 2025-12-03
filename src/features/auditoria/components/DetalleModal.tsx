import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DetalleModalProps {
    detalle: string;
    isOpen: boolean;
    onClose: () => void;
}

export const DetalleModal: React.FC<DetalleModalProps> = ({ detalle, isOpen, onClose }) => {
    if (!isOpen) return null;

    try {
        const parsedDetalle = JSON.parse(detalle);
        const detalleText = JSON.stringify(parsedDetalle, null, 2);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Detalle del Registro</h3>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            ✕
                        </Button>
                    </div>
                    <div className="p-6 overflow-auto">
                        {Object.keys(parsedDetalle).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No hay detalles adicionales</p>
                            </div>
                        ) : (
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                                {detalleText}
                            </pre>
                        )}
                    </div>
                    <div className="p-6 border-t flex justify-end">
                        <Button onClick={onClose}>Cerrar</Button>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Error al mostrar detalle</h3>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            ✕
                        </Button>
                    </div>
                    <div className="p-6 overflow-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">Error al parsear JSON:</p>
                            <p className="text-sm mt-2 text-gray-600">{detalle}</p>
                        </div>
                    </div>
                    <div className="p-6 border-t flex justify-end">
                        <Button onClick={onClose}>Cerrar</Button>
                    </div>
                </div>
            </div>
        );
    }
};
