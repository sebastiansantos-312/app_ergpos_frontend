import { describe, it, expect, vi } from 'vitest';
import {
    handleApiError,
    ApiError,
    retryWithBackoff,
    isApiError
} from '../errorHandler';

describe('Error Handler', () => {
    describe('handleApiError', () => {
        it('should handle network errors', () => {
            const networkError = {
                message: 'Network Error',
                code: 'ERR_NETWORK',
            };

            const result = handleApiError(networkError);

            expect(result).toBeInstanceOf(ApiError);
            expect(result.code).toBe('NETWORK_ERROR');
            expect(result.message).toContain('Error de conexión');
        });

        it('should handle timeout errors', () => {
            const timeoutError = {
                code: 'ECONNABORTED',
            };

            const result = handleApiError(timeoutError);

            expect(result).toBeInstanceOf(ApiError);
            expect(result.code).toBe('TIMEOUT');
        });

        it('should handle backend errors with response', () => {
            const backendError = {
                response: {
                    status: 400,
                    data: {
                        code: 'DUPLICATED_CODE',
                        message: 'Custom message',
                    },
                },
            };

            const result = handleApiError(backendError);

            expect(result).toBeInstanceOf(ApiError);
            expect(result.code).toBe('DUPLICATED_CODE');
            expect(result.status).toBe(400);
            expect(result.message).toBe('Ya existe un registro con ese código');
        });

        it('should fallback to unknown error for unmapped codes', () => {
            const unknownError = {
                response: {
                    status: 500,
                    data: {
                        code: 'WEIRD_ERROR',
                    },
                },
            };

            const result = handleApiError(unknownError);

            expect(result.code).toBe('WEIRD_ERROR');
            expect(result.message).toContain('Error inesperado');
        });
    });

    describe('retryWithBackoff', () => {
        it('should return result on success', async () => {
            const mockFn = vi.fn().mockResolvedValue('success');

            const result = await retryWithBackoff(mockFn);

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should retry on failure', async () => {
            const mockFn = vi.fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValue('success');

            const result = await retryWithBackoff(mockFn, {
                initialDelay: 10,
                maxRetries: 3
            });

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(2);
        });

        it('should fail after max retries', async () => {
            const error = new Error('fail');
            const mockFn = vi.fn().mockRejectedValue(error);

            await expect(retryWithBackoff(mockFn, {
                initialDelay: 10,
                maxRetries: 2
            })).rejects.toThrow('fail');

            expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });

        it('should not retry on non-retryable errors', async () => {
            const clientError = {
                response: { status: 400 }
            };
            const mockFn = vi.fn().mockRejectedValue(clientError);

            await expect(retryWithBackoff(mockFn)).rejects.toEqual(clientError);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('isApiError', () => {
        it('should identify ApiError instances', () => {
            const error = new ApiError('TEST', 500, 'test');
            expect(isApiError(error)).toBe(true);
        });

        it('should return false for standard errors', () => {
            const error = new Error('test');
            expect(isApiError(error)).toBe(false);
        });
    });
});
