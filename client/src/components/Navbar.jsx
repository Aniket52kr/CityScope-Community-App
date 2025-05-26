import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); 
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#15202b] border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-extrabold text-white drop-shadow-md hover:text-yellow-200 transition duration-300"
      >
        CityPulse
      </Link>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <button
              onClick={handleProfileClick}
              className="text-white hover:text-yellow-200 transition"
              title="View Profile"
            >
              <UserCircle size={28} />
            </button>
            <button
              onClick={logout}
              className="bg-white text-pink-600 font-semibold px-4 py-1 rounded hover:bg-pink-100 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white font-medium hover:text-yellow-200 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 font-semibold px-4 py-1 rounded hover:bg-purple-100 transition duration-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
