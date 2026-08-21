import api from './axios';

const ALERT_ROUTES = {
  list: '/alerts',
  create: '/alerts',
  update: (id) => `/alerts/${encodeURIComponent(id)}`,
  delete: (id) => `/alerts/${encodeURIComponent(id)}`,
};

const isValidId = (id) => id && /^[a-zA-Z0-9_-]+$/.test(String(id));

export const getAlerts = () => api.get(ALERT_ROUTES.list);
export const createAlert = (data) => api.post(ALERT_ROUTES.create, data);
export const updateAlert = (id, data) => {
  if (!isValidId(id)) throw new Error('Invalid alert ID');
  return api.put(ALERT_ROUTES.update(id), data);
};
export const deleteAlert = (id) => {
  if (!isValidId(id)) throw new Error('Invalid alert ID');
  return api.delete(ALERT_ROUTES.delete(id));
};
