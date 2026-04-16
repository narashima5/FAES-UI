import api from './kyInstance.js';

export const fetchAllSubmissions = () => api.get('submissions/all').json();
export const evaluateSubmission = (payload) => api.post('evaluations', { json: payload }).json();
