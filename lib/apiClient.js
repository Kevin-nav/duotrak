import { API_BASE_URL } from './apiConfig';

/**
 * A utility to fetch the authentication token from local storage.
 * In a real app, this might come from a secure cookie or context.
 * @returns {string|null} The auth token or null if not found.
 */
const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

/**
 * A wrapper around the native fetch API to provide a centralized
 * and consistent way to make API requests.
 *
 * @param {string} endpoint - The API endpoint to call (e.g., '/users/me').
 * @param {object} options - Configuration for the fetch request.
 * @param {string} [options.method='GET'] - The HTTP method.
 * @param {object} [options.body=null] - The request body for POST/PUT requests.
 * @param {object} [options.headers={}] - Custom headers to merge with defaults.
 * @returns {Promise<object>} - The JSON response from the API.
 */
export const apiClient = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Attempt to parse error response from the server
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
      // Throw an error that includes the status and message
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    // If response is 204 No Content, there's no body to parse
    if (response.status === 204) {
      return { success: true, data: null };
    }

    return await response.json();
  } catch (error) {
    console.error('API Client Error:', error);
    // Re-throw the error so it can be caught by the calling function
    throw error;
  }
};

// Example Usage:
/*
import { apiClient } from './lib/apiClient';

// GET request
apiClient('/users/me').then(data => console.log(data));

// POST request
apiClient('/goals', {
  method: 'POST',
  body: { title: 'New Goal', description: 'Details...' }
}).then(data => console.log(data));
*/ 