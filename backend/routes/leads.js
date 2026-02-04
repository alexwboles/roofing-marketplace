import { Router } from "express";
import {
  createLeadHandler,
  getLeadHandler
} from "../controllers/leadController.js";

const router = Router();

router.post("/", createLeadHandler);
router.get("/:id", getLeadHandler);

export default router;
