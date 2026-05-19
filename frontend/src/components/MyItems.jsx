import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';
import { addNotification } from '../store/slices/notificationSlice';
import MyItemCard from './MyItemCard';

const MyItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadUserItems = async () => {
      if (!user?._id) {
        navigate('/login');
        return;
      }

      try {
        const userItems = await itemService.getUserItems(user._id);
        setItems(userItems);
      } catch (error) {
        dispatch(addNotification({
          message: 'Failed to load items',
          type: 'error',
        }));
      } finally {
        setLoading(false);
      }
    };

    loadUserItems();
  }, [user, dispatch, navigate]);

  const filteredItems = items.filter(item => {
    if (filter === 'active') return item.status === 'active';
    if (filter === 'recovered') return item.status === 'recovered';
    return true;
  });

  const handleItemDeleted = (itemId) => {
    setItems(items.filter(item => item._id !== itemId));
  };

  const handleItemRecovered = (itemId) => {
    setItems(items.map(item =>
      item._id === itemId ? { ...item, status: 'recovered' } : item
    ));
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Items ({filteredItems.length})</h2>
        <button
          onClick={() => navigate('/post-item')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Post New Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['all', 'active', 'recovered'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              filter === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : 'Recovered'}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all'
              ? 'No items yet'
              : filter === 'active'
              ? 'No active items'
              : 'No recovered items'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'Post your first lost or found item to get started!'
              : 'No items in this category yet.'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/post-item')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Post Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <MyItemCard
              key={item._id}
              item={item}
              onItemDeleted={handleItemDeleted}
              onItemRecovered={handleItemRecovered}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
