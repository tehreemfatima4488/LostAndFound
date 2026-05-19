import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../../store/slices/itemsSlice';

const FilterBar = ({ totalCount, filteredCount }) => {
  const dispatch = useDispatch();
  const { filters, categories } = useSelector((state) => state.items);
  const categoriesList = categories.length > 0 ? categories : ['Electronics', 'Clothing', 'Documents', 'Keys', 'Accessories', 'Other'];

  const handleTypeChange = (type) => {
    dispatch(setFilter({ type }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilter({ category: e.target.value }));
  };

  const handleStatusChange = (e) => {
    dispatch(setFilter({ status: e.target.value }));
  };

  const handleSearchChange = (e) => {
    dispatch(setFilter({ search: e.target.value }));
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.status !== 'active' ||
    filters.search !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      {/* Search row */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by title or description…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lost / Found / All toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-semibold">
          {['all', 'lost', 'found'].map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`px-4 py-2 capitalize transition-colors duration-150 ${
                filters.type === t
                  ? t === 'lost'
                    ? 'bg-red-500 text-white'
                    : t === 'found'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === 'all' ? '🗂 All' : t === 'lost' ? '❌ Lost' : '✅ Found'}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="all">📦 All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Status dropdown */}
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="active">🟢 Active</option>
          <option value="recovered">🟣 Recovered</option>
          <option value="all">⚪ All Status</option>
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="px-3 py-2 text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            ✕ Clear
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto text-sm text-gray-400">
          Showing <span className="font-semibold text-gray-600">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <> of <span className="font-semibold text-gray-600">{totalCount}</span></>
          )}{' '}
          item{filteredCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default FilterBar;
