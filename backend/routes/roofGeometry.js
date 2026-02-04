import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  saveRoofGeometry,
  getRoofGeometry
} from "../controllers/roofGeometryController.js";

const router = Router();

router.use(auth);

router.post("/save", saveRoofGeometry);
router.get("/:leadId", getRoofGeometry);

export default router;
