// src/components/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Opcional: Si creaste el archivo CSS
// import './Login.css';

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

        // Asegúrate de tener tu archivo .env.local con la variable VITE_API_BASE_URL
        const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/usuarios/login`;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Intenta leer el mensaje de error del backend si lo hay
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Correo o contraseña incorrectos.');
            }

            const userData = await response.json();
            
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard'); 

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md" onSubmit={handleSubmit}>
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
                
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
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
                    <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
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

                {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
                
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