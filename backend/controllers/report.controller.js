import User from '../models/user.model.js';
import Expense from '../models/expense.model.js';
import Report from '../models/report.model.js';
import { generateReportPDF } from '../utils/generateReportPDF.js';

// 1️⃣ Preview report data (JSON)
export const getReportData = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportType = 'all', startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: 'startDate and endDate are required' });
    }

    // Build expense filter
    const expenseFilter = {
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };
    if (reportType !== 'all') {
      expenseFilter.category = reportType;
    }

    // Fetch expenses
    const data = await Expense.find(expenseFilter).sort({ date: 1 });

    // Compute summary
    const totalAmount   = data.reduce((sum, e) => sum + e.amount, 0);
    const totalCount    = data.length;
    const averageAmount = totalCount ? totalAmount / totalCount : 0;

    // Save a Report document for history
    const saved = await Report.create({
      userId,
      reportType,
      startDate,
      endDate,
      totalAmount,
      expenses: data.map(e => e._id),
      generatedAt: new Date(),
    });

    // Respond with preview JSON
    return res.json({
      success: true,
      filters: { reportType, startDate, endDate },
      data,
      summary: { totalAmount, totalCount, averageAmount },
      id: saved._id,
    });
  } catch (err) {
    console.error('getReportData error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch report data' });
  }
};

// 2️⃣ Generate & stream PDF for a fresh report
export const generatePDFReport = async (req, res) => {
  try {
    const userId = req.userId;
    const user   = await User.findById(userId).select('name');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { reportType = 'all', startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: 'startDate and endDate are required' });
    }

    // Build filter & fetch expenses
    const filters = { userId, date: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    if (reportType !== 'all') filters.category = reportType;
    const expenses   = await Expense.find(filters).sort({ date: 1 });
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCount  = expenses.length;
    const averageAmount = totalCount ? totalAmount / totalCount : 0;

    // Generate PDF doc
    const doc = generateReportPDF(
      user.name,
      reportType,
      startDate,
      endDate,
      expenses,
      totalAmount,
      totalCount,
      averageAmount
    );

    const filename = `${user.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating expense report PDF:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate expense report' });
  }
};

// 3️⃣ List past reports metadata
export const getUserReports = async (req, res) => {
  try {
    const userId = req.userId;
    const reports = await Report.find({ userId })
      .sort({ generatedAt: -1 });
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

// 4️⃣ Download an existing report by ID
export const downloadReportById = async (req, res) => {
  try {
    const userId   = req.userId;
    const reportId = req.params.id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const user = await User.findById(userId).select('name');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Re-fetch expenses & regenerate summary in case underlying data changed
    const expenses = await Expense.find({ _id: { $in: report.expenses } }).sort({ date: 1 });
    const totalAmount   = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCount    = expenses.length;
    const averageAmount = totalCount ? totalAmount / totalCount : 0;

    const doc = generateReportPDF(
      user.name,
      report.reportType,
      report.startDate,
      report.endDate,
      expenses,
      report.totalAmount,   // could use report.totalAmount
      totalCount,    // or recalc
      averageAmount
    );

    const filename = `${user.name.replace(/\s+/g, '_')}_report_${reportId}.pdf`;
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    res.setHeader('Content-Type',        'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Error downloading report:', err);
    return res.status(500).json({ success: false, message: 'Failed to download report' });
  }
};
