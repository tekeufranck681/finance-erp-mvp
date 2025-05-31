import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import expenseRoute from "./routes/expense.route.js";
import pdfRoute from "./routes/report.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());// helps us pass incoming cookie
const PORT = process.env.PORT || 4500;
//basic routes
app.use("/api/auth",authRoute);
app.use("/api/expenses",expenseRoute);
app.use("/api/download", pdfRoute);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found: ' + req.originalUrl });
})

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running at http://localhost:"+PORT);
})

