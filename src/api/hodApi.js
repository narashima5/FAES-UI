import api from './kyInstance.js';

export const fetchDepartmentStaff = () => api.get('users/department-staff').json();

export const updateNoticeboard = (noticeboard) => api.put('departments/noticeboard', { json: { noticeboard } }).json();
