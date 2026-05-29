export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || API_URL.replace(/\/api\/?$/, '');

export const assetUrl = (path = '') => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
};

