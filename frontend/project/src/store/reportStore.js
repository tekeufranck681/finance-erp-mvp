import { create } from 'zustand';
import { reportService } from '../api/services/reportService';

export const useReportStore = create((set, get) => ({
  // preview data
  reportData: null,    // { filters, data, summary, id }
  // saved metadata
  reports: [],
  // download preview URL
  downloadUrl: null,

  // status flags
  isLoading: false,
  error: null,
  message: null,


  // 1) Fetch preview
  getReportData: async (filters) => {
    set({ isLoading: true, error: null, message: null, reportData: null, downloadUrl: null });
    try {
      const result = await reportService.getReportData(
        filters.reportType,
        filters.startDate,
        filters.endDate
      );
      set({
        reportData: result,
        isLoading: false,
        message: 'Preview ready',
      });
      return result;
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Failed to load preview' });
      throw err;
    }
  },

  // 2) Generate & preview new PDF
generateReport: async () => {
    const preview = get().reportData;
    if (!preview) return null;

    set({ isLoading: true, error: null, message: null, downloadUrl: null });
    try {
      const { filters } = preview;
      // Call service to get Blob
      const blob = await reportService.generateReport(filters);
      // Create object URL
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      set({ downloadUrl: url, isLoading: false, message: 'Report ready to download' });
      await get().getReports();
      return url;
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Failed to generate report' });
      throw err;
    }
  },

  // 3) Download existing
  downloadExistingReport: async (id) => {
    set({ isLoading: true, error: null, message: null, downloadUrl: null });
    try {
      const pdfBlob = await reportService.downloadReportById(id);
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      set({ downloadUrl: url, isLoading: false, message: 'Report ready to download' });
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Failed to download report' });
      throw err;
    }
  },

  // 4) Fetch saved metadata
  getReports: async (page = 1, limit = 10, filters = {}) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const { reports, message } = await reportService.getReports(page, limit, filters);
      set({ reports, isLoading: false, message });
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Failed to fetch reports' });
    }
  },

  clearError: () => set({ error: null, message: null }),
}));
