import React, { useState } from 'react';
import UserProfile from '../components/UserProfile';
import MyItems from '../components/MyItems';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'items'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            📦 My Items
          </button>
        </div>

        {/* Content */}
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'items' && <MyItems />}
      </div>
    </div>
  );
};

export default ProfilePage;
