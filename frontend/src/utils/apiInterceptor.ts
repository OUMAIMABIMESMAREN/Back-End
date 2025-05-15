import { authService } from '../services/authService';

// Create a custom fetch function that automatically adds the auth token
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = authService.getToken();
  
  // Add authorization header if token exists
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear user data and redirect to login
    await authService.logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

// Helper function to handle JSON responses
export const fetchJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetchWithAuth(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}; 