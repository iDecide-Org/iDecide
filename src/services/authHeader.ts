/**
 * Helper function that returns the authorization header for API requests
 * Uses either the stored token or fetches a new one from the auth service
 */
export const authHeader = async (): Promise<{ Authorization?: string }> => {
  // Try to get the token from localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};