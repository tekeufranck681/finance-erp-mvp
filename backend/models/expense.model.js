import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Food", "Travel", "Office", "Utilities", "Entertainment", "Health", "Others"],
      default: "Others",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Compound unique index: name must be unique per user
expenseSchema.index({ userId: 1, name: 1 }, { unique: true });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
