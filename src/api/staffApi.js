import api from './kyInstance.js';

export const fetchMySubmissions = () => api.get('submissions/my').json();
export const fetchActivities = () => api.get('activities').json();
export const createSubmission = (formData) => api.post('submissions', { body: formData }).json();
export const updateSubmission = ({ id, formData }) => api.put(`submissions/${id}`, { body: formData }).json();
