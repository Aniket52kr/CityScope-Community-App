import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on initial render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          withCredentials: true,
          params: { _t: Date.now() }, // Prevent caching
        });

        console.log('[Auth] Fetched user:', res.data);
        setUser(res.data);
      } catch (error) {
        const errMessage = error.response?.data?.message || error.message;
        console.error('[Auth] Failed to fetch user:', errMessage);
        setUser(null); // Clear user if auth fails
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Wrap login/register/logout to update user immediately
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/login', { email, password }, { withCredentials: true })
        .then(res => {
          setUser(res.data);
          resolve(res.data);
        })
        .catch(err => {
          const msg = err.response?.data?.message || err.message;
          reject(new Error(msg));
        });
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/register', { name, email, password }, { withCredentials: true })
        .then(res => {
          setUser(res.data);
          resolve(res.data);
        })
        .catch(err => {
          const msg = err.response?.data?.message || err.message;
          reject(new Error(msg));
        });
    });
  };

  const logout = () => {
    return axios.post('/api/auth/logout', {}, { withCredentials: true })
      .then(() => setUser(null))
      .catch(err => {
        console.error('[Auth] Logout failed:', err.message);
      });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
