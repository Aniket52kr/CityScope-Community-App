import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 underline text-lg"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;