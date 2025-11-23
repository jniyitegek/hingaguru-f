const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface FetchOptions extends RequestInit {
  token?: string;
  data?: any;
}

/**
 * Custom fetch client that handles authentication and common response handling
 */
async function fetchClient(endpoint: string, { data, token, headers, ...customConfig }: FetchOptions = {}) {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : '',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    credentials: 'include',
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Handle token refresh or redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Please re-authenticate');
    }

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

/**
 * Helper function for GET requests
 */
export function fetchGET<T = any>(
  endpoint: string,
  token?: string,
  options: Omit<FetchOptions, 'token' | 'data'> = {}
): Promise<T> {
  return fetchClient(endpoint, { ...options, token, method: 'GET' });
}

/**
 * Helper function for POST requests
 */
export function fetchPOST<T = any>(
  endpoint: string,
  data: any,
  token?: string,
  options: Omit<FetchOptions, 'token' | 'data'> = {}
): Promise<T> {
  return fetchClient(endpoint, { ...options, token, data, method: 'POST' });
}

/**
 * Helper function for PUT requests
 */
export function fetchPUT<T = any>(
  endpoint: string,
  data: any,
  token?: string,
  options: Omit<FetchOptions, 'token' | 'data'> = {}
): Promise<T> {
  return fetchClient(endpoint, { ...options, token, data, method: 'PUT' });
}

/**
 * Helper function for DELETE requests
 */
export function fetchDELETE<T = any>(
  endpoint: string,
  token?: string,
  options: Omit<FetchOptions, 'token' | 'data'> = {}
): Promise<T> {
  return fetchClient(endpoint, { ...options, token, method: 'DELETE' });
}

export default fetchClient;
