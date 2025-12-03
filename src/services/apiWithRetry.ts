import api from './api';
import { retryWithBackoff } from '@/core/errors';

/**
 * API Client with Retry Logic
 * 
 * Wrapper around the base API client that adds automatic retry logic
 * for failed requests. Use this for critical operations that should
 * be retried on transient failures.
 * 
 * @example
 * ```typescript
 * import { apiWithRetry } from '@/services/apiWithRetry';
 * 
 * const response = await apiWithRetry.get('/productos');
 * ```
 */

interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
}

/**
 * Creates an API client method with retry logic
 */
function createRetryMethod<T = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete'
) {
    return async (url: string, data?: any, options?: RetryOptions): Promise<T> => {
        return retryWithBackoff(
            async () => {
                if (method === 'get' || method === 'delete') {
                    const response = await api[method](url, data);
                    return response.data;
                } else {
                    const response = await api[method](url, data);
                    return response.data;
                }
            },
            {
                maxRetries: options?.maxRetries,
                initialDelay: options?.initialDelay,
            }
        );
    };
}

/**
 * API client with automatic retry logic for all methods
 * 
 * Use this instead of the regular `api` client when you want
 * automatic retries for transient failures (network errors, timeouts, 5xx errors)
 */
export const apiWithRetry = {
    get: createRetryMethod('get'),
    post: createRetryMethod('post'),
    put: createRetryMethod('put'),
    patch: createRetryMethod('patch'),
    delete: createRetryMethod('delete'),
};
