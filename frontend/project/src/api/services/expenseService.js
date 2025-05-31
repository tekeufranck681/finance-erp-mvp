import api from '../axiosConfigExpense';

export const expenseService = {
getExpenses: async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await api.get('/', {
      params: { page, limit, ...filters },
    });
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message);
    }
    return { data, message };
  } catch (error) {
    console.error("Expense service error:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch expenses");
  }
},


  getExpenseById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      const { success, message, data } = response.data;
      if (!success) {
        throw new Error(message);
      }
      return { data, message };
    } catch (error) {
      throw error;
    }
  },

createExpense: async (expenseData) => {
  try {
    const response = await api.post('/create', expenseData);
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message);
    }
    return { success, message, data }; // <-- include success here
  } catch (error) {
    throw error;
  }
},

 // src/api/services/expenseService.js
 updateExpense: async (id, expenseData) => {
    const response = await api.put(`/update/${id}`, expenseData);
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message);
    }
    return { success, message, data }; // include success
  },

  // DELETE
  deleteExpense: async (id) => {
    try {
      const response = await api.delete(`/delete/${id}`);
      const { success, message } = response.data;
      if (!success) {
        throw new Error(message);
      }
      // no data payload on delete, just return message
      return { success, message };
    } catch (error) {
      throw error;
    }
  },
};
