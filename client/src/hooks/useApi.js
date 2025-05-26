// src/hooks/useApi.js
import { useState } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        ...config,
        withCredentials: true,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, apiCall };
};