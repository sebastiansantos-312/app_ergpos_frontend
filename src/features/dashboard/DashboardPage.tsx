import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDashboard } from './hooks/useDashboard';
import { StatsGrid } from './components/StatsGrid';
import { QuickActionsCard } from './components/QuickActionsCard';
import { InfoCard } from './components/InfoCard';

export const DashboardPage: React.FC = () => {
    const {
        user,
        isLoading,
        availableStats,
        availableActions,
        handleNavigate,
    } = useDashboard();

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bienvenido, {user?.nombre}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Rol: <span className="font-semibold">{user?.rol}</span>
                    </p>
                </div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : availableStats.length > 0 ? (
                    <StatsGrid
                        stats={availableStats}
                        onNavigate={handleNavigate}
                    />
                ) : null}

                {/* Quick Actions */}
                <QuickActionsCard
                    actions={availableActions}
                    onNavigate={handleNavigate}
                />

                {/* Info Card */}
                <InfoCard />
            </div>
        </AppLayout>
    );
};
