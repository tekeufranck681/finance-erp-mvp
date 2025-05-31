import express from "express";
import { deleteExpense, getAllExpenses, getExpense, postExpense ,putExpense} from "../controllers/expense.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

 const router = express.Router();


 router.post("/create",authenticateToken ,postExpense);
 router.put("/update/:id",authenticateToken,putExpense);
 router.delete("/delete/:id",authenticateToken,deleteExpense);
 router.get("/",authenticateToken,getAllExpenses);
 router.get("/:id",authenticateToken,getExpense);

 export default router;