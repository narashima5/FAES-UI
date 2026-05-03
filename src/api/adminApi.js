import api from './kyInstance.js';

// Users
export const fetchUsers = () => api.get('users').json();
export const createUser = (userData) => api.post('users', { json: userData }).json();
export const deleteUser = (id) => api.delete(`users/${id}`).json();

// Departments
export const fetchDepartments = () => api.get('departments').json();
export const createDepartment = (name) => api.post('departments', { json: { name } }).json();

// Activities
export const fetchSections = () => api.get('activities/sections').json();
export const fetchActivities = () => api.get('activities').json();
export const createSection = (title) => api.post('activities/sections', { json: { title } }).json();
export const createSubSection = ({ section_id, title }) => api.post('activities/subsections', { json: { section_id, title } }).json();
export const createActivity = (activityData) => api.post('activities', { json: activityData }).json();
export const updateActivity = ({ id, payload }) => api.put(`activities/${id}`, { json: payload }).json();
export const deleteActivity = (id) => api.delete(`activities/${id}`).json();

// Settings
export const fetchSettings = () => api.get('settings').json();
export const updateSettings = (settingsData) => api.put('settings', { json: settingsData }).json();
