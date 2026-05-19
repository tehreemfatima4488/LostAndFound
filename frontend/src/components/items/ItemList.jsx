import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchSuccess, fetchError, fetchCategoriesSuccess } from '../../store/slices/itemsSlice';
import itemService from '../../services/itemService';
import ItemCard from './ItemCard';
import FilterBar from './FilterBar';

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="flex gap-2 mt-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const ItemList = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error, filters } = useSelector((state) => state.items);

  // Fetch categories from backend on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await itemService.getCategories();
        dispatch(fetchCategoriesSuccess(categoriesData));
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, [dispatch]);

  // Fetch from backend whenever type or status filter changes
  useEffect(() => {
    const load = async () => {
      dispatch(fetchStart());
      try {
        const data = await itemService.getItems({
          type: filters.type,
          status: filters.status,
        });
        dispatch(fetchSuccess(data));
      } catch (err) {
        dispatch(fetchError(err.message || 'Failed to load items'));
      }
    };
    load();
  }, [dispatch, filters.type, filters.status]);

  // Client-side filtering: category + search text
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, filters.category, filters.search]);

  return (
    <div>
      <FilterBar totalCount={items.length} filteredCount={filteredItems.length} />

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <p className="text-gray-400 text-sm mt-1">Check that the backend is running on port 5000</p>
        </div>
      )}

      {/* Loading skeleton grid */}
      {isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-400">
            Try adjusting your filters or search term
          </p>
        </div>
      )}

      {/* Items grid */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
