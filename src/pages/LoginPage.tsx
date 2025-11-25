import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, type LoginFormData } from '../schema/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AlertCircle, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            clearError();
            await login(data);
            navigate('/dashboard');
        } catch (err) {
            // Error handling is done in the store
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">ERGPOS</h1>
                        <p className="text-gray-600">Sistema de Gestión de Inventario</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username/Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Usuario o Email
                            </label>
                            <Input
                                {...register('username')}
                                type="text"
                                placeholder="ejemplo@email.com"
                                disabled={isLoading}
                                className={errors.username ? 'border-red-500' : ''}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-10"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <LoadingSpinner size="sm" />
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <LogIn className="w-4 h-4" />
                                    <span>Iniciar Sesión</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    {/* <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Credenciales de prueba:</p>
                        <p className="mt-2 bg-gray-100 p-2 rounded text-xs">
                            <strong>Email:</strong> admin@ergpos.com<br />
                            <strong>Contraseña:</strong> password123
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};