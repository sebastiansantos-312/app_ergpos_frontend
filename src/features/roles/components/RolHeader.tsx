import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface RolHeaderProps {
    totalRoles: number;
    onCreate: () => void;
}

export const RolHeader: React.FC<RolHeaderProps> = ({
    totalRoles,
    onCreate,
}) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestionar Roles</h1>
                <p className="text-gray-600 mt-1">
                    Total: <span className="font-semibold">{totalRoles}</span> roles
                </p>
            </div>
            <Button
                onClick={onCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Nuevo Rol
            </Button>
        </div>
    );
};
