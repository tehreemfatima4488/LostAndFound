import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ItemList from '../components/items/ItemList';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                Lost & Found 🔍
              </h1>
              <p className="text-blue-100 text-lg">
                {isAuthenticated
                  ? `Welcome back, ${user?.name}! Browse items below.`
                  : 'Help reunite people with their lost belongings.'}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-xl border border-blue-300 hover:bg-blue-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <ItemList />
      </div>
    </div>
  );
};

export default Home;
