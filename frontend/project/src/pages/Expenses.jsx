import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';

import { useExpenseStore } from '../store/expenseStore';
import ExpenseForm from '../components/expense/ExpenseForm';

import { formatDate, formatCurrency } from '../utils/formatter';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Expenses = () => {
  const {
    expenses,
    isLoading,
    getExpenses,
    showForm,
    setShowForm,
    selectedExpense,
    setSelectedExpense,
    deleteExpense,
    createExpense, updateExpense
  } = useExpenseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getExpenses();
  }, []);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

 const handleDeleteExpense = async (id) => {
  try {
    await deleteExpense(id);
    toast.success('Expense deleted successfully');
  } catch (err) {
    toast.error('Failed to delete expense');
  }
};


  const closeForm = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (payload, id) => {
  try {
    if (id) {
      await updateExpense(id, payload);
      toast.success("Expense updated successfully");
    } else {
      await createExpense(payload);
      toast.success("Expense created successfully");
    }
  } catch (err) {
    toast.error(err.message);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Filter by searchQuery on description and name (optional)
  const filteredExpenses = expenses.filter((e) =>
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by the selected field, handle numbers and strings properly
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (!sortField) return 0;

    const aField = a[sortField];
    const bField = b[sortField];

    // If sorting by amount (number), parse as floats
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? parseFloat(aField) - parseFloat(bField)
        : parseFloat(bField) - parseFloat(aField);
    }

    // For strings: use localeCompare safely
    if (typeof aField === 'string' && typeof bField === 'string') {
      return sortDirection === 'asc'
        ? aField.localeCompare(bField)
        : bField.localeCompare(aField);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const currentExpenses = sortedExpenses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalAmount = sortedExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600">Manage your expenses and track your spending</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddExpense}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Expense
          </motion.button>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm w-full">
  <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full">
    
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search expenses By Description..."
        className="pl-10 py-3 pr-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-sm"
      />
    </div>

    <div className="flex space-x-2">
      <button type="submit" className="btn btn-primary w-full md:w-auto">
        Search
      </button>
      <button
        type="button"
        className="btn btn-outline w-full md:w-auto"
        onClick={() => toast.info('Filter functionality not implemented')}
      >
        <Filter className="mr-2 h-4 w-4" /> Filter
      </button>
    </div>
    
  </form>
</div>


        {/* Table */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <motion.table
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  <tr>
                    {/* Added 'name' here */}
                    {['name', 'description', 'category', 'date', 'amount'].map((field) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                          field === 'amount' ? 'text-right' : 'text-left'
                        } cursor-pointer`}
                      >
                        <div className={`flex ${field === 'amount' ? 'justify-end' : 'items-center'}`}>
                          {field.charAt(0).toUpperCase() + field.slice(1)} {getSortIcon(field)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No expenses found.
                      </td>
                    </tr>
                  ) : (
                    currentExpenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {/* Added expense.name */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.name}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{expense.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(expense.date)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-right text-green-600">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="mr-2 text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </motion.table>
            )}
          </div>
          {/* Summary */}
          <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700">
          <div>Total Expenses: {sortedExpenses.length}</div>
          <div>Total Amount: {formatCurrency(totalAmount)}</div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center space-x-4 border-t border-gray-200 bg-white px-6 py-3">
          <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn btn-outline disabled:opacity-50"
          >
          <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="inline-flex items-center rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
          Page {page} of {totalPages || 1}
          </span>
          <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="btn btn-outline disabled:opacity-50"
          >
          <ChevronRight className="h-4 w-4" />
          </button>
          </div>
        </div>

        {showForm && (
         <ExpenseForm
  expense={selectedExpense}
  onSubmit={handleFormSubmit}
  onClose={() => setShowForm(false)}
/>  )}
      </motion.div>
    </>
  );
};

export default Expenses;
