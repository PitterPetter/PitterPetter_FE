import { api } from '../../shared/api/base';

// API 호출 함수
export const mapboxApi = {
  getMapboxData: () => api.get('/api/mapbox'),
};