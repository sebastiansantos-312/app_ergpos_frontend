import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCard {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    href: string;
}

interface StatsGridProps {
    stats: StatCard[];
    onNavigate: (href: string) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, onNavigate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div
                    key={stat.title}
                    onClick={() => onNavigate(stat.href)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                >
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.color} text-white p-2 rounded-lg`}>
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};
