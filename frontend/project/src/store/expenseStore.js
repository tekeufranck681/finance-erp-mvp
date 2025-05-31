import { create } from 'zustand';
import { expenseService } from '../api/services/expenseService';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  expense: null,
  isLoading: false,
  error: null,
  message: null,
  showForm: false,
  selectedExpense: null,
  setShowForm: (value) => set({ showForm: value }),
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),

  // Fetch paginated and filtered expenses
 getExpenses: async (page = 1, limit = 10, filters = {}) => {
  set({ isLoading: true, error: null, message: null });
  try {
    const { data: expenses, message } = await expenseService.getExpenses(page, limit, filters);
    // Since your service returns { data, message } but no success here (already handled)
    set({ expenses, isLoading: false, message });
    return { expenses, message };
  } catch (error) {
    set({
      isLoading: false,
      error: error.message || 'Failed to load expenses',
    });
    throw error;
  }
},


  // Fetch a single expense by ID
  getExpenseById: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const data = await expenseService.getExpenseById(id);
      const { success, message, data: expense } = data;
      if (!success) throw new Error(message);
      set({ expense, isLoading: false, message });
      return { expense, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Failed to load expense',
      });
      throw error;
    }
  },

 createExpense: async (expenseData) => {
  set({ isLoading: true, error: null, message: null });

  try {
    const { success, message, data: newExpense } = await expenseService.createExpense(expenseData);

    if (!success) throw new Error(message);

    // Call getExpenses from the store to refresh the list
    const { getExpenses } = useExpenseStore.getState(); // 👈 IMPORTANT
    await getExpenses(); // 👈 Refresh expenses list

    set({
      isLoading: false,
      message: message || 'Expense added successfully',
    });

    return { newExpense, message };
  } catch (error) {
    set({
      isLoading: false,
      error: error.message || 'Failed to create expense',
    });
    throw error;
  }
},


 updateExpense: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const { success, message } = await expenseService.updateExpense(id, payload);
      if (!success) throw new Error(message);
      // Re-fetch to get the fresh data set
      await get().getExpenses();
      set({ isLoading: false, message });
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

 deleteExpense: async (id) => {
  try {
    const { success, message } = await expenseService.deleteExpense(id);

    if (!success) {
      throw new Error(message);
    }

    // Update the local store: remove the deleted expense
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense._id !== id),
    }));

    // Optionally show success toast
    console.log("Deleted successfully:", message);
  } catch (error) {
    // Handle error appropriately
    console.error("Delete failed:", error.message);
    throw error; // Optional: re-throw for UI to catch
  }
},

  clearError: () => set({ error: null, message: null }),
}));
