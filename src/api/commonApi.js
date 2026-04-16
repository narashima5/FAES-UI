import api from './kyInstance.js';

export const fetchSections = () => api.get('activities/sections').json();
export const fetchSubSections = () => api.get('activities/subsections').json();
export const fetchActivities = () => api.get('activities').json();
export const fetchSummary = () => api.get('reports/summary').json();
