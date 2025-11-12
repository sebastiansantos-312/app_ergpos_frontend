// src/components/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Body enviado:', { email, password });
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/usuarios/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                throw new Error('Correo o contraseña incorrectos.');
            }

            const userData = await response.json();

            // 🚫 Por seguridad, eliminamos la contraseña antes de guardarlo
            const { password: _, ...safeUser } = userData;

            localStorage.setItem('user', JSON.stringify(safeUser));

            // ✅ Redirige según el rol del usuario (opcional)
            if (safeUser.rol?.nombre === 'ADMIN') {
                navigate('/dashboard/admin');
            } else if (safeUser.rol?.nombre === 'TECNICO') {
                navigate('/dashboard/tecnico');
            } else if (safeUser.rol?.nombre === 'VENDEDOR') {
                navigate('/dashboard/ventas');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form
                className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
                onSubmit={handleSubmit}
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Iniciar Sesión
                </h2>

                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="email"
                    >
                        Correo Electrónico
                    </label>
                    <input
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-6">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="password"
                    >
                        Contraseña
                    </label>
                    <input
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <p className="mb-4 text-center text-sm text-red-500">{error}</p>
                )}

                <div className="flex items-center justify-between">
                    <button
                        className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-400"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
