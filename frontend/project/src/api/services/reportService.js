import api from '../axiosConfigReport';

export const reportService = {
  /**
   * Fetch preview data: expenses + summary + saved report ID
   */
 getReportData: async (reportType, startDate, endDate) => {
  try {
    const response = await api.post('/report/data', {
      reportType,
      startDate,
      endDate
    });
    const { success, message, filters, data, summary, id } = response.data;
    if (!success) throw new Error(message);
    return { filters, data, summary, id };
  } catch (err) {
    console.error('reportService.getReportData error:', err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch report preview');
  }
},


  /**
   * Generate & download a new PDF report (returns Blob)
   */
 generateReport: async ({ reportType, startDate, endDate, includeChart }) => {
    try {
      const response = await api.post(
        '/report',
        { reportType, startDate, endDate, includeChart },
        { responseType: 'blob' }
      );
      return response.data; // Blob
    } catch (err) {
      console.error('reportService.generateReport error:', err.message);
      throw new Error(err.response?.data?.message || 'Failed to generate report');
    }
  },

  /**
   * Download an existing saved report by its ID (returns Blob)
   */
  downloadReportById: async (id) => {
    try {
      const response = await api.get(`/report/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (err) {
      console.error('reportService.downloadReportById error:', err.message);
      throw new Error(err.response?.data?.message || 'Failed to download report');
    }
  },

  /**
   * Fetch paginated list of past report metadata
   */
  getReports: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/get-reports', {
        params: { page, limit, ...filters },
      });
      const { success, message, reports } = response.data;
      if (!success) throw new Error(message);
      return { reports, message };
    } catch (err) {
      console.error('reportService.getReports error:', err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch reports');
    }
  },
};
