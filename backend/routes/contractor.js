import { Router } from "express";
import auth from "../middleware/auth.js";
import { updatePricing } from "../controllers/contractorController.js";

const router = Router();

router.use(auth);

router.post("/pricing", updatePricing);

export default router;
