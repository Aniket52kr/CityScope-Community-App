// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api', // Use env var or fallback
  withCredentials: true, //  Ensures cookies like JWT are sent with every request
});



// Interceptor: Log all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] Request → ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  }
);


// Interceptor: Handle all response errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[API] Response ← ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    console.error('[API] Response error:', message);
    return Promise.reject(error);
  }
);

export default apiClient;