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
};

export default itemService;
