import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const searchProducts = (q) => api.get('/products/search', { params: { q } });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductPrices = (id) => api.get(`/products/${id}/prices`);
export const getCategories = () => api.get('/categories');
export const getStores = () => api.get('/stores');