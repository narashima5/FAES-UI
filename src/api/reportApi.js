import api from './kyInstance.js';

export const fetchDepartmentReport = () => api.get('reports/department').json();
export const fetchGlobalReport = () => api.get('reports/global').json();
export const fetchMonthlyFacultyReport = (month, year) => {
   const searchParams = new URLSearchParams();
   if (month) searchParams.append('month', month);
   if (year) searchParams.append('year', year);
   return api.get('reports/monthly', { searchParams }).json();
};
