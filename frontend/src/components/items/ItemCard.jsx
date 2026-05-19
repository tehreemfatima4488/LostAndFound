import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  Electronics: '📱',
  Clothing: '👕',
  Documents: '📄',
  Keys: '🔑',
  Accessories: '👜',
  Other: '📦',
};

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  const isLost = item.type === 'lost';
  const isRecovered = item.status === 'recovered';
  const categoryIcon = CATEGORY_ICONS[item.category] || '📦';

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      onClick={() => navigate(`/items/${item._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div
          className="w-full h-full flex items-center justify-center text-5xl"
          style={{ display: item.imageUrl ? 'none' : 'flex' }}
        >
          {categoryIcon}
        </div>

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isLost
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {item.type}
        </span>

        {/* Recovered badge */}
        {isRecovered && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white uppercase tracking-wider">
            Recovered ✓
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {item.category && (
            <span className="flex-shrink-0 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
              {categoryIcon} {item.category}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex flex-col gap-1 text-xs text-gray-400 mt-auto">
          {item.locationText && (
            <span className="flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{item.locationText}</span>
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{formattedDate}</span>
            </span>
          )}
          {item.userID?.name && (
            <span className="flex items-center gap-1">
              <span>👤</span>
              <span>Posted by {item.userID.name}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
