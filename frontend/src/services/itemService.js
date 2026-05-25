import api from './api';

const itemService = {
  // GET /api/items — supports ?type=lost|found and ?status=active|recovered
  getItems: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.type && params.type !== 'all') query.set('type', params.type);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    const response = await api.get(`/items?${query.toString()}`);
    // backend returns { count, data: [...] }
    return response.data.data;
  },

  // GET /api/items/:id
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // GET /api/items/categories
  getCategories: async () => {
    const response = await api.get('/items/categories');
    return response.data;
  },

  // GET /api/users/:id/items - Get user's items
  getUserItems: async (userId) => {
    const response = await api.get(`/users/${userId}/items`);
    return response.data.data || response.data;
  },

  // POST /api/items - Create new item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // PUT /api/items/:id - Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // DELETE /api/items/:id - Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  // PUT /api/items/:id/recover - Mark item as recovered
  recoverItem: async (id) => {
    const response = await api.put(`/items/${id}/recover`);
    return response.data;
  },

  // POST /api/upload - Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default itemService;
