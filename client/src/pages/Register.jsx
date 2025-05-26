import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axios.post(
        '/api/auth/register',
        { name, email, password },
        { withCredentials: true }
      );

      console.log('Registration successful:', res.data);
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md min-h-[400px] flex flex-col justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>

          {error && (
            <p className="text-red-500 mb-4 text-center">{error}</p>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              autoComplete="name"
              required
            />

            {/* Email Field */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: '#1DA1F2' }}
            className="w-full text-white py-2 rounded-md hover:brightness-90 transition"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-[#1DA1F2] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
