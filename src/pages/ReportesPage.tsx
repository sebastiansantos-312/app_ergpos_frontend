import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, TrendingUp, Package, Users } from 'lucide-react';

export const ReportesPage: React.FC = () => {
    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
                    <p className="text-gray-600 mt-1">
                        Genera y visualiza reportes del sistema
                    </p>
                </div>

                {/* Tipos de Reportes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Reporte de Inventario */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                Reporte de Inventario
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Genera un reporte completo del estado actual del inventario
                            </p>
                        </CardContent>
                    </Card>

                    {/* Reporte de Movimientos */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Reporte de Movimientos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Analiza las entradas y salidas de productos en un período
                            </p>
                        </CardContent>
                    </Card>

                    {/* Reporte de Usuarios */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Reporte de Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Visualiza la actividad y estadísticas de usuarios
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Placeholder */}
                <Card className="bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-900">Módulo en Desarrollo</p>
                                <p className="text-sm text-gray-600">
                                    Esta funcionalidad estará disponible próximamente
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};