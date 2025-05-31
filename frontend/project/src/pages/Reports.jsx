import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FileText, Download, Printer, Clock } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useReportStore } from '../store/reportStore';

const Reports = () => {
  const {
    reportData,
    reports,
    downloadUrl,
    isLoading,
    error,
    message,
    getReportData,
    generateReport,
    downloadExistingReport,
    getReports,
  } = useReportStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      reportType: 'all',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      includeChart: true,
    },
  });

  const filters = watch(['reportType', 'startDate', 'endDate', 'includeChart']);

  useEffect(() => {
    getReports();
  }, []);

  const onSubmit = async (data) => {
    try {
      await getReportData(data);
      toast.success('Preview ready');
    } catch {
      toast.error('Failed to load preview');
    }
  };

const downloadPDF = async () => {
    try {
      // Generate the PDF and get its download URL directly
      const url = await generateReport();

      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(url);

        toast.success('Report downloaded!');
      } else {
        toast.error('No download URL available');
      }
    } catch {
      toast.error('Failed to download');
    }
  };


  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Left panel: Inline Form */}
      <motion.div
        className="card p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Generate Report</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Report Type */}
          <div className="mb-4">
            <label htmlFor="reportType" className="form-label">Report Type</label>
            <select
              id="reportType"
              className={`form-input ${errors.reportType ? 'border-red-500' : ''}`}
              {...register('reportType', { required: 'Report type is required' })}
            >
              <option value="all">All</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Office">Office</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Others">Others</option>
            </select>
            {errors.reportType && <p className="form-error">{errors.reportType.message}</p>}
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              id="startDate"
              type="date"
              className={`form-input ${errors.startDate ? 'border-red-500' : ''}`}
              {...register('startDate', { required: 'Start date is required' })}
            />
            {errors.startDate && <p className="form-error">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              id="endDate"
              type="date"
              className={`form-input ${errors.endDate ? 'border-red-500' : ''}`}
              {...register('endDate', { required: 'End date is required' })}
            />
            {errors.endDate && <p className="form-error">{errors.endDate.message}</p>}
          </div>

          {/* Include Chart */}
          <div className="mb-6 flex items-center">
            <input
              id="includeChart"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
              {...register('includeChart')}
            />
            <label htmlFor="includeChart" className="ml-2 text-sm text-gray-700">
              Include charts in report
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? <LoadingSpinner size="sm" className="mr-2" />
              : <FileText className="mr-2 h-4 w-4" />
            }
            {isSubmitting || isLoading ? 'Loading Preview...' : 'Load Preview'}
          </motion.button>

          {reportData && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={downloadPDF}
              className="btn btn-secondary w-full mt-4"
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </motion.button>
          )}
        </form>
      </motion.div>

      {/* Middle panel: Preview Summary */}
      <motion.div
        className="lg:col-span-2 space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {reportData ? (
          <div className="card overflow-x-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">{reportData.filters.reportType} Report</h3>
              <p className="text-sm text-gray-500">
                {new Date(reportData.filters.startDate).toLocaleDateString()} –{' '}
                {new Date(reportData.filters.endDate).toLocaleDateString()}
              </p>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-sm font-medium text-blue-700">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalCount}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="text-sm font-medium text-red-700">Total Amount</p>
                <p className="text-2xl font-bold text-red-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(reportData.summary.totalAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-sm font-medium text-green-700">Average Amount</p>
                <p className="text-2xl font-bold text-green-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(reportData.summary.averageAmount)}
                </p>
              </div>
            </div>
            {/* Expenses Table */}
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.data.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{exp.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{exp.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{exp.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{exp.vendor}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-right text-red-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card flex h-64 items-center justify-center text-gray-500">
            <FileText className="h-16 w-16 mb-4" />
            <p>No report preview. Fill the form to see a preview.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Reports;
