import React from 'react';
import EditItemForm from '../components/EditItemForm';

const EditItemPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <EditItemForm />
      </div>
    </div>
  );
};

export default EditItemPage;
