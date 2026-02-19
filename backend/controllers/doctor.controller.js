import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ─── Get All Doctors ──────────────────────────────────────────────────────────
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ isVerified: true })
    .populate("userId", "username email")
    .select(
      "userId specialization experience clinicAddress clinicTiming consultationFee qualifications bio isVerified createdAt"
    );

  if (!doctors || doctors.length === 0) {
    throw new ApiError(404, "No doctors found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { doctors, count: doctors.length }, "Doctors fetched successfully")
    );
});

// ─── Get Doctor by ID ─────────────────────────────────────────────────────────
const getDoctorById = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await Doctor.findById(doctorId).populate("userId", "username email");

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { doctor }, "Doctor fetched successfully"));
});

// ─── Update Doctor Info ───────────────────────────────────────────────────────
const updateDoctorInfo = asyncHandler(async (req, res) => {
  const user = req.user; // From auth middleware
  const {
    specialization,
    experience,
    clinicAddress,
    clinicTiming,
    consultationFee,
    qualifications,
    bio,
  } = req.body;

  // Check if user is a doctor
  if (user.usertype !== "doctor") {
    throw new ApiError(403, "Only doctors can update doctor info");
  }

  // Find doctor by userId
  const doctor = await Doctor.findOne({ userId: user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  // Update only provided fields
  if (specialization) doctor.specialization = specialization;
  if (experience !== undefined) doctor.experience = experience;
  if (clinicAddress) doctor.clinicAddress = clinicAddress;
  if (clinicTiming) doctor.clinicTiming = clinicTiming;
  if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
  if (qualifications) doctor.qualifications = qualifications;
  if (bio) doctor.bio = bio;

  const updatedDoctor = await doctor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { doctor: updatedDoctor }, "Doctor info updated successfully")
    );
});

// ─── Update Doctor Clinic Timing ──────────────────────────────────────────────
const updateClinicTiming = asyncHandler(async (req, res) => {
  const user = req.user;
  const { clinicTiming } = req.body;

  if (user.usertype !== "doctor") {
    throw new ApiError(403, "Only doctors can update clinic timing");
  }

  if (!clinicTiming || clinicTiming.length === 0) {
    throw new ApiError(400, "Clinic timing is required");
  }

  const doctor = await Doctor.findOne({ userId: user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  doctor.clinicTiming = clinicTiming;
  const updatedDoctor = await doctor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { doctor: updatedDoctor }, "Clinic timing updated successfully")
    );
});

// ─── Update Doctor Clinic Address ─────────────────────────────────────────────
const updateClinicAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { clinicAddress } = req.body;

  if (user.usertype !== "doctor") {
    throw new ApiError(403, "Only doctors can update clinic address");
  }

  if (!clinicAddress) {
    throw new ApiError(400, "Clinic address is required");
  }

  const doctor = await Doctor.findOne({ userId: user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  doctor.clinicAddress = clinicAddress;
  const updatedDoctor = await doctor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { doctor: updatedDoctor }, "Clinic address updated successfully")
    );
});

// ─── Update Consultation Fee ──────────────────────────────────────────────────
const updateConsultationFee = asyncHandler(async (req, res) => {
  const user = req.user;
  const { consultationFee } = req.body;

  if (user.usertype !== "doctor") {
    throw new ApiError(403, "Only doctors can update consultation fee");
  }

  if (consultationFee === undefined) {
    throw new ApiError(400, "Consultation fee is required");
  }

  const doctor = await Doctor.findOne({ userId: user._id });
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  doctor.consultationFee = consultationFee;
  const updatedDoctor = await doctor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { doctor: updatedDoctor }, "Consultation fee updated successfully")
    );
});

export {
  getAllDoctors,
  getDoctorById,
  updateDoctorInfo,
  updateClinicTiming,
  updateClinicAddress,
  updateConsultationFee,
};
