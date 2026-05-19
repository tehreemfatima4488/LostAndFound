import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  categories: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    type: 'all',       // 'all' | 'lost' | 'found'
    category: 'all',   // 'all' | category string
    status: 'active',  // 'active' | 'recovered' | 'all'
    search: '',
  },
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchError,
  setSelectedItem,
  clearSelectedItem,
  setFilter,
  resetFilters,
  fetchCategoriesSuccess,
} = itemsSlice.actions;

export default itemsSlice.reducer;
