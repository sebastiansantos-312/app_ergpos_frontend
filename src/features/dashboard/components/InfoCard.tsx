import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Lock } from 'lucide-react';

export const InfoCard: React.FC = () => {
    return (
        <Card className="bg-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Información del Sistema</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-gray-700">
                        Usa la barra lateral izquierda para navegar entre los diferentes módulos del sistema.
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Los módulos disponibles dependen de tu rol y permisos.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
