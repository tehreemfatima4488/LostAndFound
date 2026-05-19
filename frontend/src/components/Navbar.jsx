import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
            Lost & Found
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 md:gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors hidden sm:inline"
                >
                  👤 Profile
                </Link>
                <Link
                  to="/post-item"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  📝 Post Item
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 hidden sm:inline">
                    Welcome, <span className="font-semibold">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
