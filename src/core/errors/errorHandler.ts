/**
 * Centralized Error Handling Service
 * 
 * Provides standardized error handling across the application.
 * All API errors should be processed through handleApiError().
 */

export class ApiError extends Error {
    code: string;
    status: number;
    details?: any;

    constructor(
        code: string,
        status: number,
        message: string,
        details?: any
    ) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, ApiError);
        }
    }
}

/**
 * Centralized error messages
 * Maps error codes from backend to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
    // Common errors
    'DUPLICATED_CODE': 'Ya existe un registro con ese código',
    'NOT_FOUND': 'Recurso no encontrado',
    'VALIDATION_ERROR': 'Hay errores en los datos enviados',
    'UNAUTHORIZED': 'No tienes permisos para realizar esta acción',
    'FORBIDDEN': 'Acceso denegado',
    'NETWORK_ERROR': 'Error de conexión. Verifica tu conexión a internet',
    'TIMEOUT': 'La solicitud tardó demasiado tiempo',
    'UNKNOWN_ERROR': 'Error inesperado. Por favor, intenta nuevamente',

    // Producto errors
    'PRODUCTO_NOT_FOUND': 'El producto no fue encontrado',
    'CATEGORIA_NOT_FOUND': 'La categoría seleccionada no existe',
    'CATEGORIA_INACTIVE': 'La categoría está inactiva',
    'STOCK_BELOW_MINIMUM': 'El stock actual no puede ser menor al stock mínimo',
    'INVALID_PRICE': 'El precio debe ser mayor a 0',

    // Usuario errors
    'USUARIO_NOT_FOUND': 'El usuario no fue encontrado',
    'EMAIL_ALREADY_EXISTS': 'Ya existe un usuario con ese email',
    'INVALID_CREDENTIALS': 'Credenciales inválidas',
    'PASSWORD_TOO_WEAK': 'La contraseña es muy débil',
    'CURRENT_PASSWORD_INCORRECT': 'La contraseña actual es incorrecta',

    // Rol errors
    'ROL_NOT_FOUND': 'El rol no fue encontrado',
    'ROL_IN_USE': 'No se puede eliminar el rol porque está siendo usado',

    // Proveedor errors
    'PROVEEDOR_NOT_FOUND': 'El proveedor no fue encontrado',
    'RUC_ALREADY_EXISTS': 'Ya existe un proveedor con ese RUC',

    // Movimiento errors
    'MOVIMIENTO_NOT_FOUND': 'El movimiento no fue encontrado',
    'INSUFFICIENT_STOCK': 'Stock insuficiente para realizar la salida',
    'INVALID_QUANTITY': 'La cantidad debe ser mayor a 0',
};

/**
 * Handles API errors and converts them to ApiError instances
 * 
 * @param error - The error object from axios or other source
 * @returns ApiError instance with standardized information
 */
export const handleApiError = (error: any): ApiError => {
    // Network error (no response from server)
    if (!error.response) {
        if (error.code === 'ECONNABORTED') {
            return new ApiError('TIMEOUT', 0, ERROR_MESSAGES['TIMEOUT']);
        }
        return new ApiError('NETWORK_ERROR', 0, ERROR_MESSAGES['NETWORK_ERROR']);
    }

    const code = error.response?.data?.code || 'UNKNOWN_ERROR';
    const status = error.response?.status || 500;
    const details = error.response?.data?.details;

    // Get message from our map or fallback to backend message
    let message = ERROR_MESSAGES[code];

    if (!message) {
        message = error.response?.data?.message || ERROR_MESSAGES['UNKNOWN_ERROR'];
    }

    return new ApiError(code, status, message, details);
};

/**
 * Checks if an error is an ApiError instance
 */
export const isApiError = (error: any): error is ApiError => {
    return error instanceof ApiError;
};

/**
 * Gets a user-friendly error message from any error
 */
export const getErrorMessage = (error: any): string => {
    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ERROR_MESSAGES['UNKNOWN_ERROR'];
};

/**
 * Retry Configuration
 */
interface RetryConfig {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryableStatuses?: number[];
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, Rate limit, Server errors
};

/**
 * Retries a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param config - Retry configuration options
 * @returns Promise that resolves with the function result or rejects after all retries
 * 
 * @example
 * ```typescript
 * const data = await retryWithBackoff(
 *   () => api.get('/productos'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    config: RetryConfig = {}
): Promise<T> {
    const {
        maxRetries,
        initialDelay,
        maxDelay,
        backoffMultiplier,
        retryableStatuses,
    } = { ...DEFAULT_RETRY_CONFIG, ...config };

    let lastError: any;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Don't retry if it's the last attempt
            if (attempt === maxRetries) {
                break;
            }

            // Check if error is retryable
            const status = error.response?.status;
            const isRetryable = !status || retryableStatuses.includes(status);

            if (!isRetryable) {
                // Don't retry client errors (4xx except specific ones)
                break;
            }

            // Log retry attempt
            logError(error, {
                context: 'Retry Attempt',
                attempt: attempt + 1,
                maxRetries,
                nextDelay: delay,
            });

            // Wait before retrying
            await sleep(delay);

            // Increase delay for next attempt (exponential backoff)
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }

    // All retries failed
    throw lastError;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Error Logging Configuration
 */
interface ErrorLogContext {
    context?: string;
    userId?: string;
    timestamp?: string;
    [key: string]: any;
}

/**
 * Centralized error logging
 * 
 * Logs errors to console in development and can be extended
 * to send errors to external monitoring services in production
 * 
 * @param error - The error to log
 * @param context - Additional context information
 * 
 * @example
 * ```typescript
 * logError(error, {
 *   context: 'Product Creation',
 *   userId: user.id,
 *   productCode: 'PROD-001'
 * });
 * ```
 */
export function logError(error: any, context?: ErrorLogContext): void {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        message: getErrorMessage(error),
        ...(isApiError(error) && {
            code: error.code,
            status: error.status,
            details: error.details,
        }),
        ...(error instanceof Error && {
            name: error.name,
            stack: error.stack,
        }),
        ...context,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
        console.error('🔴 Error logged:', errorInfo);
    }

    // In production, you would send this to an error monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    // if (import.meta.env.PROD) {
    //     sendToErrorMonitoring(errorInfo);
    // }
}

/**
 * Checks if an error is a network error (no response from server)
 */
export function isNetworkError(error: any): boolean {
    return !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error');
}

/**
 * Checks if an error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
    return error.code === 'ECONNABORTED' || error.response?.status === 408;
}

/**
 * Checks if an error is a server error (5xx)
 */
export function isServerError(error: any): boolean {
    const status = error.response?.status;
    return status >= 500 && status < 600;
}

/**
 * Checks if an error is a client error (4xx)
 */
export function isClientError(error: any): boolean {
    const status = error.response?.status;
    return status >= 400 && status < 500;
}

