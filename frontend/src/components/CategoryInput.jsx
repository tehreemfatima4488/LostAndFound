import React, { useState, useEffect, useRef } from 'react';

const CategoryInput = ({ value, onChange, categories = [], loading }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customInputMode, setCustomInputMode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If value doesn't match any category, show custom input mode
    if (value && categories.length > 0 && !categories.includes(value)) {
      setCustomInputMode(true);
    }
  }, [value, categories]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectCategory = (cat) => {
    onChange('category', cat);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => {
            setCustomInputMode(false);
            onChange('category', '');
            setSearchTerm('');
          }}
          className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
            !customInputMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          From List
        </button>
        <button
          type="button"
          onClick={() => {
            setCustomInputMode(true);
            onChange('category', '');
            setSearchTerm('');
          }}
          className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
            customInputMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Custom
        </button>
      </div>

      {customInputMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange('category', e.target.value)}
          placeholder="Enter custom category..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      ) : (
        <div className="relative">
          <input
            type="text"
            value={showDropdown ? searchTerm : (value || searchTerm)}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={categories.length > 0 ? 'Search or select category...' : 'Loading categories...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading && categories.length === 0}
            required
          />

          {showDropdown && !loading && categories.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      value === cat ? 'bg-blue-100 font-semibold' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">No categories found</div>
              )}
            </div>
          )}

          {loading && (
            <div className="absolute right-3 top-2.5 text-gray-400">
              <span className="animate-spin">⌛</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
