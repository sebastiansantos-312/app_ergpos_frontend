import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, type LoginFormData } from '../schema/index';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AlertCircle, LogIn, XCircle, ShieldAlert, UserX } from 'lucide-react';

// Función para determinar el tipo de error y su mensaje amigable
const getErrorDetails = (error: string) => {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('credenciales') || errorLower.includes('incorrecta') || errorLower.includes('invalid')) {
        return {
            icon: XCircle,
            title: 'Credenciales incorrectas',
            message: 'El usuario o contraseña que ingresaste no son correctos. Por favor, verifica e intenta nuevamente.',
            variant: 'destructive' as const
        };
    }

    if (errorLower.includes('inactivo') || errorLower.includes('inactive') || errorLower.includes('desactivado')) {
        return {
            icon: UserX,
            title: 'Usuario inactivo',
            message: 'Tu cuenta ha sido desactivada. Contacta al administrador para más información.',
            variant: 'destructive' as const
        };
    }

    if (errorLower.includes('bloqueado') || errorLower.includes('blocked') || errorLower.includes('locked')) {
        return {
            icon: ShieldAlert,
            title: 'Cuenta bloqueada',
            message: 'Tu cuenta ha sido bloqueada temporalmente. Contacta al administrador.',
            variant: 'destructive' as const
        };
    }

    if (errorLower.includes('red') || errorLower.includes('network') || errorLower.includes('conexión')) {
        return {
            icon: AlertCircle,
            title: 'Error de conexión',
            message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            variant: 'destructive' as const
        };
    }

    // Error genérico
    return {
        icon: AlertCircle,
        title: 'Error al iniciar sesión',
        message: error || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
        variant: 'destructive' as const
    };
};

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Limpiar error cuando el usuario empiece a escribir
    const watchedFields = watch();
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [watchedFields.username, watchedFields.password]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            clearError();
            await login(data);
            navigate('/dashboard');
        } catch (err) {
            // Error handling is done in the store
        }
    };

    const errorDetails = error ? getErrorDetails(error) : null;
    const ErrorIcon = errorDetails?.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">ERGSYSTEM</h1>
                        <p className="text-gray-600">Sistema de Gestión de Inventario</p>
                    </div>

                    {/* Error Alert - Mejorado */}
                    {error && errorDetails && (
                        <Alert
                            variant={errorDetails.variant}
                            className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                            <div className="flex items-start gap-3">
                                {ErrorIcon && <ErrorIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                                <div className="flex-1">
                                    <AlertTitle className="font-semibold mb-1">
                                        {errorDetails.title}
                                    </AlertTitle>
                                    <AlertDescription className="text-sm">
                                        {errorDetails.message}
                                    </AlertDescription>
                                </div>
                            </div>
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
                                className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                autoComplete="username"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.username.message}
                                </p>
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
                                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    disabled={isLoading}
                                    tabIndex={-1}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-10 transition-all"
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

                    {/* Footer opcional - puedes descomentar si lo necesitas */}
                    {/* <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Olvidaste tu contraseña?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Recuperar
                            </a>
                        </p>
                    </div> */}
                </div>

                {/* Info adicional */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-white/80">
                        © 2025 ERGSYSTEM. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};