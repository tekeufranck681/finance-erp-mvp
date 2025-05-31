import express from "express";
import { generatePDFReport ,getUserReports, downloadReportById, getReportData } from "../controllers/report.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/report", authenticateToken, generatePDFReport);
router.get("/get-reports", authenticateToken, getUserReports);
router.post('/report/data', authenticateToken, getReportData);
router.get('/report/:id', authenticateToken, downloadReportById);
export default router;
