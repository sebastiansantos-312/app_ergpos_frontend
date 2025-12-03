import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface QuickAction {
    name: string;
    href: string;
}

interface QuickActionsCardProps {
    actions: QuickAction[];
    onNavigate: (href: string) => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ actions, onNavigate }) => {
    if (actions.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Acciones Rápidas</span>
                </CardTitle>
                <CardDescription>
                    Accede rápidamente a los módulos principales
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map((action) => (
                        <button
                            key={action.name}
                            onClick={() => onNavigate(action.href)}
                            className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left font-medium text-gray-900 hover:text-blue-600"
                        >
                            {action.name}
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
