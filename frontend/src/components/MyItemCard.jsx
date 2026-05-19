import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import itemService from '../services/itemService';
import { addNotification } from '../store/slices/notificationSlice';
import DeleteConfirmation from './DeleteConfirmation';

const MyItemCard = ({ item, onItemDeleted, onItemRecovered }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await itemService.deleteItem(item._id);
      dispatch(addNotification({ message: 'Item deleted successfully', type: 'success' }));
      setShowDeleteModal(false);
      onItemDeleted(item._id);
    } catch (error) {
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to delete item',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async () => {
    setLoading(true);
    try {
      await itemService.recoverItem(item._id);
      dispatch(addNotification({ message: 'Item marked as recovered', type: 'success' }));
      onItemRecovered(item._id);
    } catch (error) {
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to recover item',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const isRecovered = item.status === 'recovered';

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isRecovered ? 'opacity-60' : ''}`}>
        {/* Image */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              🖼️
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
              item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
              isRecovered ? 'bg-gray-500' : 'bg-blue-500'
            }`}>
              {isRecovered ? 'Recovered' : 'Active'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Category:</span>
              <p>{item.category}</p>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <p>{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Location:</span>
              <p>{item.locationText}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => navigate(`/items/${item._id}`)}
              className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
            >
              View
            </button>
            {!isRecovered && (
              <>
                <button
                  onClick={() => navigate(`/edit-item/${item._id}`)}
                  className="flex-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleRecover}
                  disabled={loading}
                  className="flex-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? '⌛' : '✓ Recover'}
                </button>
              </>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={loading}
      />
    </>
  );
};

export default MyItemCard;
