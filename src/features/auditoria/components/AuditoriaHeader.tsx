import React from 'react';

interface AuditoriaHeaderProps {
    totalRegistros: number;
}

export const AuditoriaHeader: React.FC<AuditoriaHeaderProps> = ({
    totalRegistros,
}) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Auditoría del Sistema</h1>
            <p className="text-gray-600 mt-1">
                Historial de cambios: <span className="font-semibold">{totalRegistros}</span> registros
            </p>
        </div>
    );
};
