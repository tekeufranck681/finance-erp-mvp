import express from "express";
import { login, logout, signup ,checkAuth} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
const router = express.Router();

router.get("/check-auth",authenticateToken,checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;