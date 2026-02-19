import { Router } from "express";
import {
  getAllDoctors,
  getDoctorById,
  updateDoctorInfo,
  updateClinicTiming,
  updateClinicAddress,
  updateConsultationFee,
} from "../controllers/doctor.controller.js";
// import { auth } from "../middlewares/auth.js"; // Uncomment when auth middleware is ready

const router = Router();

// Public routes
router.get("/", getAllDoctors);
router.get("/:doctorId", getDoctorById);

// Protected routes (auth middleware to be added later)
// router.put("/update", auth, updateDoctorInfo);
// router.put("/timing/update", auth, updateClinicTiming);
// router.put("/address/update", auth, updateClinicAddress);
// router.put("/fee/update", auth, updateConsultationFee);

export default router;
