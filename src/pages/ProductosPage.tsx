import { Layout } from '../components/shared/Layout';
import React from 'react';
import ProductoManagement from '../components/ProductoManagement';

const ProductosPage: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                        <p className="text-gray-600 mt-2">
                            Administra el inventario de productos, precios y estados
                        </p>
                    </div>
                    <ProductoManagement />
                </div>
            </div>
        </Layout>
    );
};

export default ProductosPage;