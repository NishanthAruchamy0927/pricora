import api from './axios';

export const getAdminStats    = ()        => api.get('/admin/stats');
export const getAdminUsers    = ()        => api.get('/admin/users');
export const toggleUser       = (id)      => api.put(`/admin/users/${id}/toggle`);
export const deleteAdminUser  = (id)      => api.delete(`/admin/users/${id}`);
export const getAdminPrices   = ()        => api.get('/admin/prices');
export const createAdminPrice = (data)    => api.post('/admin/prices', data);
export const updateAdminPrice = (id, data)=> api.put(`/admin/prices/${id}`, data);
export const deleteAdminPrice = (id)      => api.delete(`/admin/prices/${id}`);

// Re-export product/category/store admin calls
export const createProduct    = (data)    => api.post('/products', data);
export const updateProduct    = (id, data)=> api.put(`/products/${id}`, data);
export const deleteProduct    = (id)      => api.delete(`/products/${id}`);
export const createCategory   = (data)    => api.post('/categories', data);
export const updateCategory   = (id, data)=> api.put(`/categories/${id}`, data);
export const deleteCategory   = (id)      => api.delete(`/categories/${id}`);
export const createStore      = (data)    => api.post('/stores', data);
export const updateStore      = (id, data)=> api.put(`/stores/${id}`, data);
export const deleteStore      = (id)      => api.delete(`/stores/${id}`);
