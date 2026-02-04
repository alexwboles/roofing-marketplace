import { Router } from "express";
import { login, registerContractor } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register-contractor", registerContractor);

export default router;
