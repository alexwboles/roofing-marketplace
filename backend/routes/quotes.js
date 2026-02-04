import { Router } from "express";
import { generateQuotes, listQuotes } from "../controllers/quoteController.js";

const router = Router();

router.post("/generate", generateQuotes);
router.get("/lead/:leadId", listQuotes);

export default router;
