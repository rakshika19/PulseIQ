import { Router } from "express";
import { getQuestions, submitAssessment } from "../controllers/assessment.controller.js";

const router = Router();

router.post("/assess", getQuestions);
router.post("/submit", submitAssessment);

export default router;
