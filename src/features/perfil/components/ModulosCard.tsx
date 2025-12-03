import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModulosCardProps {
    modules: string[];
}

export const ModulosCard: React.FC<ModulosCardProps> = ({ modules }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Módulos Disponibles</CardTitle>
                <CardDescription>Módulos a los que tienes acceso según tu rol</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {modules.map((module) => (
                        <div
                            key={module}
                            className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                            <p className="text-sm font-medium text-blue-900 capitalize">
                                {module}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
