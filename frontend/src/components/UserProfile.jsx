import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';
import { addNotification } from '../store/slices/notificationSlice';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user);
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    activeItems: 0,
    recoveredItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?._id) {
        navigate('/login');
        return;
      }

      try {
        const userItems = await itemService.getUserItems(user._id);
        const stats = {
          totalItems: userItems.length,
          lostItems: userItems.filter(item => item.type === 'lost').length,
          foundItems: userItems.filter(item => item.type === 'found').length,
          activeItems: userItems.filter(item => item.status === 'active').length,
          recoveredItems: userItems.filter(item => item.status === 'recovered').length,
        };
        setStats(stats);
      } catch (error) {
        dispatch(addNotification({
          message: 'Failed to load profile stats',
          type: 'error',
        }));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, dispatch, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'auth/logout' });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-4xl animate-spin">⌛</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-blue-100">{user?.email}</p>
            <p className="text-blue-100 text-sm mt-2">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
            </p>
          </div>
          <div className="text-5xl">👤</div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Posts', value: stats.totalItems, icon: '📋', color: 'blue' },
          { label: 'Lost Items', value: stats.lostItems, icon: '❌', color: 'red' },
          { label: 'Found Items', value: stats.foundItems, icon: '✅', color: 'green' },
          { label: 'Active', value: stats.activeItems, icon: '🔵', color: 'yellow' },
          { label: 'Recovered', value: stats.recoveredItems, icon: '✔️', color: 'purple' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg shadow p-4 text-center border-t-4 border-${stat.color}-500`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/post-item')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          📝 Post New Item
        </button>
        <button
          onClick={() => navigate('/my-items')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          📦 My Items
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          🚪 Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Posts Recovery Rate</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${stats.totalItems > 0 ? (stats.recoveredItems / stats.totalItems) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {stats.totalItems > 0 ? Math.round((stats.recoveredItems / stats.totalItems) * 100) : 0}%
            </span>
          </div>
          <div className="pt-3 border-t border-blue-200">
            <p className="text-sm text-gray-600">
              You've posted <span className="font-bold">{stats.totalItems}</span> items.{' '}
              {stats.recoveredItems > 0
                ? `${stats.recoveredItems} have been successfully recovered!`
                : 'Keep posting to help the community!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
