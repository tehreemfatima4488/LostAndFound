import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';

const CATEGORY_ICONS = {
  Electronics: '📱',
  Clothing: '👕',
  Documents: '📄',
  Keys: '🔑',
  Accessories: '👜',
  Other: '📦',
};

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Item not found or could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading item details…</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{error}</h2>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isRecovered = item.status === 'recovered';
  const categoryIcon = CATEGORY_ICONS[item.category] || '📦';

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const formattedPostedAt = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
        >
          <span>←</span> Back to listings
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Image section */}
          <div className="relative h-72 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-full h-full flex items-center justify-center text-8xl"
              style={{ display: item.imageUrl ? 'none' : 'flex' }}
            >
              {categoryIcon}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                  isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {item.type}
              </span>
              {isRecovered && (
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-purple-500 text-white uppercase tracking-wider">
                  Recovered ✓
                </span>
              )}
            </div>
          </div>

          {/* Details section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {item.title}
              </h1>
              {item.category && (
                <span className="flex-shrink-0 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm">
                  {categoryIcon} {item.category}
                </span>
              )}
            </div>

            {item.description && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {item.locationText && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Location</p>
                    <p className="text-gray-700 font-medium">{item.locationText}</p>
                  </div>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                      {isLost ? 'Lost on' : 'Found on'}
                    </p>
                    <p className="text-gray-700 font-medium">{formattedDate}</p>
                  </div>
                </div>
              )}
              {item.userID && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Posted by</p>
                    <p className="text-gray-700 font-medium">{item.userID.name}</p>
                    <p className="text-gray-400 text-sm">{item.userID.email}</p>
                  </div>
                </div>
              )}
              {formattedPostedAt && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl">🕐</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Posted on</p>
                    <p className="text-gray-700 font-medium">{formattedPostedAt}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status info */}
            <div
              className={`p-4 rounded-xl border-l-4 ${
                isRecovered
                  ? 'bg-purple-50 border-purple-400'
                  : isLost
                  ? 'bg-red-50 border-red-400'
                  : 'bg-green-50 border-green-400'
              }`}
            >
              <p className={`font-semibold text-sm ${
                isRecovered ? 'text-purple-700' : isLost ? 'text-red-700' : 'text-green-700'
              }`}>
                {isRecovered
                  ? '✓ This item has been recovered.'
                  : isLost
                  ? '❌ This item is currently lost. If you have found it, please contact the poster.'
                  : '✅ This item was found. If this is yours, please contact the poster.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
