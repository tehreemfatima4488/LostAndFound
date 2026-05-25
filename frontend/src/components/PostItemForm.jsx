import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';
import { addNotification } from '../store/slices/notificationSlice';
import ImageUpload from './ImageUpload';
import CategoryInput from './CategoryInput';

const FormStep1 = ({ data, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
      <input
        type="text"
        value={data.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="e.g., Blue Backpack with Keys"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
      <textarea
        value={data.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Describe the item in detail..."
        rows="4"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
  </div>
);

const FormStep2 = ({ data, onChange, categories, loading }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="lost"
            checked={data.type === 'lost'}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Lost Item</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="found"
            checked={data.type === 'found'}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Found Item</span>
        </label>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
      <CategoryInput
        value={data.category}
        onChange={onChange}
        categories={categories}
        loading={loading}
      />
    </div>
  </div>
);

const FormStep3 = ({ data, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
      <input
        type="date"
        value={data.date}
        onChange={(e) => onChange('date', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
      <input
        type="text"
        value={data.locationText}
        onChange={(e) => onChange('locationText', e.target.value)}
        placeholder="e.g., Near Library, Building A"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
  </div>
);

const FormStep4 = ({ data, onChange, onImageSelect, loading, preview }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Item Image *</label>
    <ImageUpload
      onImageSelect={onImageSelect}
      preview={preview}
      loading={loading}
    />
  </div>
);

const FormStep5 = ({ data, categories }) => (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-bold text-gray-900 mb-4">Review Your Post</h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">Title:</span>
          <span className="ml-2 text-gray-600">{data.title}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Type:</span>
          <span className="ml-2 text-gray-600 capitalize">{data.type}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Category:</span>
          <span className="ml-2 text-gray-600">{data.category}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Date:</span>
          <span className="ml-2 text-gray-600">{new Date(data.date).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Location:</span>
          <span className="ml-2 text-gray-600">{data.locationText}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Description:</span>
          <p className="text-gray-600 mt-1">{data.description}</p>
        </div>
      </div>
    </div>
  </div>
);

const PostItemForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: '',
    date: new Date().toISOString().split('T')[0],
    locationText: '',
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const cats = await itemService.getCategories();
        console.log('Categories fetched:', cats);
        if (active) {
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isMountedRef.current) {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description;
      case 2:
        return formData.type && formData.category;
      case 3:
        return formData.date && formData.locationText;
      case 4:
        return imageFile;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isStepValid()) {
      dispatch(addNotification({ message: 'Please fill all fields', type: 'error' }));
      return;
    }

    if (!isMountedRef.current) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('category', formData.category);
      data.append('date', formData.date);
      data.append('locationText', formData.locationText);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await itemService.createItem(data);
      
      if (isMountedRef.current) {
        dispatch(addNotification({ message: 'Item posted successfully!', type: 'success' }));
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate('/profile');
          }
        }, 300);
      }
    } catch (error) {
      if (isMountedRef.current) {
        dispatch(addNotification({
          message: error.response?.data?.message || error.message || 'Failed to post item',
          type: 'error',
        }));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const progressSteps = ['Info', 'Type & Category', 'Location', 'Image', 'Review'];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {progressSteps.map((stepName, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  idx + 1 <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {idx + 1}
              </div>
              {idx < progressSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    idx + 1 < step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">Step {step} of 5: {progressSteps[step - 1]}</p>
      </div>

      {/* Form Steps */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {step === 1 && <FormStep1 data={formData} onChange={handleInputChange} />}
        {step === 2 && <FormStep2 data={formData} onChange={handleInputChange} categories={categories} loading={categoriesLoading} />}
        {step === 3 && <FormStep3 data={formData} onChange={handleInputChange} />}
        {step === 4 && (
          <FormStep4
            data={formData}
            onChange={handleInputChange}
            onImageSelect={handleImageSelect}
            loading={false}
            preview={imagePreview}
          />
        )}
        {step === 5 && <FormStep5 data={formData} categories={categories} />}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            {step < 5 ? (
              <button
                key="next-button"
                type="button"
                onClick={() => isStepValid() && setStep(step + 1)}
                disabled={!isStepValid() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                key="submit-button"
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Posting...</span>
                  </>
                ) : (
                  'Post Item'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostItemForm;
