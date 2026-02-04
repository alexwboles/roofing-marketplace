import { Router } from "express";
import {
  requestRoofAnalysis,
  getRoofAnalysis
} from "../controllers/roofAnalysisController.js";

const router = Router();

router.post("/request", requestRoofAnalysis);
router.get("/:leadId", getRoofAnalysis);

export default router;
