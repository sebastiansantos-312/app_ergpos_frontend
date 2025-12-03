import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Here you could send error to an error reporting service
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Algo salió mal
                        </h1>

                        <p className="text-gray-600 text-center mb-6">
                            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                        </p>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-gray-100 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Detalles del error (solo en desarrollo):
                                </p>
                                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-gray-600 overflow-auto max-h-32 mt-2">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={this.handleReset}
                                className="w-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reintentar
                            </Button>

                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="w-full"
                            >
                                Ir al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
