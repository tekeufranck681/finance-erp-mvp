import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar 
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Local state to replace Zustand store state
  const [summaryData, setSummaryData] = useState(null);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Replace this function with your own data fetching logic
  const fetchAllDashboardData = async () => {
    setIsLoading(true);
    try {
      // Example: fetch summary data from API
      // Replace these with your API calls or static data
      const fetchedSummary = {
        totalExpenses: 1200,
        monthlyExpenses: 200,
        totalIncome: 2500,
        balance: 1300,
      };

      const fetchedExpensesByCategory = [
        { category: 'Food', amount: 300 },
        { category: 'Transport', amount: 150 },
        { category: 'Utilities', amount: 200 },
        { category: 'Entertainment', amount: 100 },
        { category: 'Health', amount: 50 },
      ];

      const fetchedMonthlyExpenses = [
        { month: 'Jan', amount: 100 },
        { month: 'Feb', amount: 150 },
        { month: 'Mar', amount: 130 },
        { month: 'Apr', amount: 200 },
        { month: 'May', amount: 220 },
      ];

      const fetchedRecentTransactions = [
        {
          id: '1',
          description: 'Grocery Shopping',
          category: 'Food',
          date: '2025-05-25',
          amount: 50,
          type: 'expense',
        },
        {
          id: '2',
          description: 'Salary',
          category: 'Income',
          date: '2025-05-24',
          amount: 2500,
          type: 'income',
        },
      ];

      // Update states
      setSummaryData(fetchedSummary);
      setExpensesByCategory(fetchedExpensesByCategory);
      setMonthlyExpenses(fetchedMonthlyExpenses);
      setRecentTransactions(fetchedRecentTransactions);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  // Chart options and data
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses',
      },
    },
  };

  const barChartData = {
    labels: monthlyExpenses?.map((data) => data.month) || [],
    datasets: [
      {
        label: 'Expenses',
        data: monthlyExpenses?.map((data) => data.amount) || [],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  };

  const doughnutChartData = {
    labels: expensesByCategory?.map((data) => data.category) || [],
    datasets: [
      {
        data: expensesByCategory?.map((data) => data.amount) || [],
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(13, 148, 136, 0.7)',
          'rgba(217, 119, 6, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(13, 148, 136, 1)',
          'rgba(217, 119, 6, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your financial data.</p>
      </div>

      {/* Summary Cards */}
      <motion.div variants={item} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <h3 className="text-xl font-bold">{formatCurrency(summaryData?.totalExpenses || 0)}</h3>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <h3 className="text-xl font-bold">{formatCurrency(summaryData?.monthlyExpenses || 0)}</h3>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Income</p>
            <h3 className="text-xl font-bold">{formatCurrency(summaryData?.totalIncome || 0)}</h3>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Balance</p>
            <h3 className="text-xl font-bold">{formatCurrency(summaryData?.balance || 0)}</h3>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Expense Trend</h3>
          <div className="h-64">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Expenses by Category</h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={item} className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Description
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{txn.description}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{txn.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm font-semibold text-right ${
                      txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                    No recent transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
