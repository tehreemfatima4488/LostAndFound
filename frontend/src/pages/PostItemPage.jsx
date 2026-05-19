import React from 'react';
import PostItemForm from '../components/PostItemForm';

const PostItemPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <PostItemForm />
      </div>
    </div>
  );
};

export default PostItemPage;
