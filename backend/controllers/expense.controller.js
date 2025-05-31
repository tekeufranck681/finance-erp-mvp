import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
export const postExpense = async (req, res) => {
  const { name, amount, category, date, description, vendor } = req.body;
  const userId = req.userId;

  if (!name || !amount || !description || !vendor) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter All fields" });
  }

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      userId,
      category,
      description,
      date,
      vendor,
    });

    return res.status(201).json({
      success: true,
      data: newExpense,
      message: "Expense Added",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `You already have an expense named "${name}".`,
      });
    }

    console.error("Error when adding an expense:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const putExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    // Check if the expense exists for the user
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Expense ID" });
    }
    const existingExpense = await Expense.findOne({ _id: id, userId: userId });
    if (!existingExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    if (!req.body) {
  return res.status(400).json({
    success: false,
    message: "Request body is missing",
  });
}

    const { name, amount, description, category, vendor } = req.body;

    // If no changes are provided, return a response
    if (!name && !amount && !category && !description && !vendor) {
      return res
        .status(400)
        .json({ success: false, message: "No changes provided" });
    }

    // Check if another expense exists with the same name for the same user
    if (name) {
      const duplicateExpense = await Expense.findOne({
        name: name,
        userId: userId,
        _id: { $ne: id },
      });
      if (duplicateExpense) {
        return res.status(409).json({
          success: false,
          message: `There is already an expense with name ${name}`,
        });
      }
    }

    // Prepare update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (amount) updateData.amount = amount;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (vendor) updateData.vendor = vendor;

    // Update the expense
    await Expense.updateOne({ _id: id, userId: userId }, { $set: updateData });

    // Fetch the updated expense
    const updatedExpense = await Expense.findOne({ _id: id, userId: userId });

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error in updating expense:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const userId = req.userId;
    
    // Extract filters from query, but remove page and limit to avoid misuse
    const { page: _, limit: __, ...otherFilters } = req.query;

    // Combine filters with userId
    const query = { userId, ...otherFilters };

    // Fetch paginated and filtered expenses
    const expenses = await Expense.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ success: true, message: "Expenses fetched successfully", data: expenses });
  } catch (error) {
    console.error("Error in Getting All Expenses:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const deleteExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }

  try {
    const expense = await Expense.deleteOne({ _id: id, userId: userId });
    res
      .status(200)
      .json({ success: true, message: "Expense Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
    console.error("Error in Expense Deletion", error.message);
  }
};
export const getExpense = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID" });
  }
  try {
    const userId = req.userId;
    const existingExpense = await Expense.findOne({ _id: id, userId: userId });

    if (!existingExpense) {
  return res
    .status(404)
    .json({ success: false, message: "Expense not found" });
}

    res.status(200).json({ success: true, data: existingExpense });
  } catch (error) {
    console.error("Error when fetching expense:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};