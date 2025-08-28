/**
 * useApiRequest - Custom hook for handling API requests with loading and error states
 */
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing API requests with loading and error states
 * 
 * @template T The type of data returned by the API
 * @param {Function} apiFunction The async function that makes the API request
 * @param {boolean} [loadOnMount=false] Whether to automatically call the API function on mount
 * @param {T} [initialData=null] Initial data value
 * @returns {Object} Object containing loading state, error state, data, and execute function
 */
const useApiRequest = (apiFunction, loadOnMount = false, initialData = null) => {
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialData);

  /**
   * Execute the API request
   * @param {any} args Arguments to pass to the API function
   * @returns {Promise<T>} The data returned by the API
   */
  const execute = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  // Automatically execute on mount if loadOnMount is true
  if (loadOnMount && isLoading && !data && !error) {
    execute();
  }

  return {
    isLoading,
    error,
    data,
    execute,
    setData, // Expose for manual updates
    setError, // Expose for manual error setting
    reset: useCallback(() => {
      setData(initialData);
      setError(null);
      setIsLoading(false);
    }, [initialData]),
  };
};

export default useApiRequest;
