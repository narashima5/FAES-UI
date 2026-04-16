import api from './kyInstance.js';

export const fetchDepartmentReport = () => api.get('reports/department').json();
export const fetchGlobalReport = () => api.get('reports/global').json();
