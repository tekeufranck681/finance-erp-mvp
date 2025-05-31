import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  reportType: { type: String, default: "all" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  generatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);
export default Report;
