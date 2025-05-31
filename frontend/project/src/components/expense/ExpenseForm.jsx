import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const ExpenseForm = ({ expense, onClose, onSubmit }) => {
  const isEditing = Boolean(expense);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: expense?.name || '',
      description: expense?.description || '',
      amount: expense?.amount || '',
      vendor: expense?.vendor || '',
      category: expense?.category || '',
      date: expense
        ? new Date(expense.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  // When `expense` changes (i.e. editing), reset the form values
  useEffect(() => {
    if (expense) {
      reset({
        name: expense.name,
        description: expense.description,
        amount: expense.amount,
        vendor: expense.vendor,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
      });
    }
  }, [expense, reset]);

const submitHandler = async (data) => {
  // build payload
  const payload = {
    ...data,
    amount: parseFloat(data.amount),
    date: new Date(data.date).toISOString(),
  };

  await onSubmit(payload, expense?._id);
  onClose();
};

  const categoryOptions = [
    "Food",
    "Travel",
    "Office",
    "Utilities",
    "Entertainment",
    "Health",
    "Others",
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              id="description"
              type="text"
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Must be > 0' },
                valueAsNumber: true,
              })}
            />
            {errors.amount && <p className="form-error">{errors.amount.message}</p>}
          </div>

          {/* Vendor */}
          <div className="mb-4">
            <label htmlFor="vendor" className="form-label">Vendor</label>
            <input
              id="vendor"
              type="text"
              className={`form-input ${errors.vendor ? 'border-red-500' : ''}`}
              {...register('vendor', { required: 'Vendor is required' })}
            />
            {errors.vendor && <p className="form-error">{errors.vendor.message}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className={`form-input ${errors.category ? 'border-red-500' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div className="mb-6">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              id="date"
              type="date"
              className={`form-input ${errors.date ? 'border-red-500' : ''}`}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="form-error">{errors.date.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Expense'
                  : 'Add Expense'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;
