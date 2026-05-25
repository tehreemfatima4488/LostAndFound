import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import itemService from '../services/itemService';
import { addNotification } from '../store/slices/notificationSlice';
import ImageUpload from './ImageUpload';
import CategoryInput from './CategoryInput';

const EditItemForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isMountedRef = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    locationText: '',
    imageUrl: '',
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setCategoriesLoading(true);
        const [itemData, cats] = await Promise.all([
          itemService.getItemById(id),
          itemService.getCategories(),
        ]);

        if (active) {
          setCategories(Array.isArray(cats) ? cats : []);
          setFormData({
            title: itemData.title,
            description: itemData.description,
            category: itemData.category,
            date: itemData.date.split('T')[0],
            locationText: itemData.locationText,
            imageUrl: itemData.imageUrl,
          });
          setImagePreview(itemData.imageUrl);
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          dispatch(addNotification({ message: 'Failed to load item', type: 'error' }));
          navigate('/profile');
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [id, dispatch, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isMountedRef.current) return;
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('date', formData.date);
      data.append('locationText', formData.locationText);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await itemService.updateItem(id, data);
      
      if (isMountedRef.current) {
        dispatch(addNotification({ message: 'Item updated successfully!', type: 'success' }));
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate(`/items/${id}`);
          }
        }, 300);
      }
    } catch (error) {
      if (isMountedRef.current) {
        dispatch(addNotification({
          message: error.response?.data?.message || error.message || 'Failed to update item',
          type: 'error',
        }));
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-4xl animate-spin">⌛</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <CategoryInput
            value={formData.category}
            onChange={handleInputChange}
            categories={categories}
            loading={categoriesLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            value={formData.locationText}
            onChange={(e) => handleInputChange('locationText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Image (optional)</label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={imagePreview}
            loading={false}
          />
        </div>

        <div className="flex gap-3 justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin">⌛</span>
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditItemForm;
