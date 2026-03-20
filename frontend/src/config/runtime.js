const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
const envBackendOrigin = (import.meta.env.VITE_BACKEND_ORIGIN || '').trim();

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const fallbackBackendOrigin = isLocalhost
  ? 'http://localhost:5001'
  : 'https://whatsapp-backend-3eab.onrender.com';

export const API_BASE_URL = envApiUrl || `${envBackendOrigin || fallbackBackendOrigin}/api`;
export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
