import React from 'react';
import MovimientoInventario from '../components/MovimientoInventario';
import { Layout } from '../components/shared/Layout';

const MovimientosPage: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Movimientos de Inventario</h1>
                        <p className="text-gray-600 mt-2">
                            Registra y consulta entradas y salidas del inventario
                        </p>
                    </div>
                    <MovimientoInventario />
                </div>
            </div>
        </Layout>
    );
};

export default MovimientosPage;