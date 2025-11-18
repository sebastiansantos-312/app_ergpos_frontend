import React from 'react';
import { useAuthStore } from '../stores/authStore';

export const AuthDebug: React.FC = () => {
    const { user, token, isAuthenticated, isLoading } = useAuthStore();

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded shadow-lg text-sm max-w-md">
            <h3 className="font-bold mb-2">🔍 Debug de Autenticación</h3>
            <div className="space-y-1">
                <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
                <p><strong>Token:</strong> {token ? `✅ Presente (${token.substring(0, 20)}...)` : '❌ Faltante'}</p>
                <p><strong>Usuario:</strong> {user?.email || '❌ No user'}</p>
                <p><strong>Roles:</strong> {user?.roles?.join(', ') || '❌ Sin roles'}</p>
                <p><strong>Loading:</strong> {isLoading ? '⏳ Sí' : '✅ No'}</p>
            </div>
            <button
                onClick={() => {
                    console.log('🔐 Token completo:', token);
                    console.log('👤 User completo:', user);
                    console.log('🏪 localStorage token:', localStorage.getItem('token'));
                    console.log('🏪 localStorage user:', localStorage.getItem('user'));
                }}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
            >
                Log en consola
            </button>
        </div>
    );
};