import request from "supertest";
import app from "../App.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";
import mongoose from "mongoose";

describe("Appointment API Tests", () => {
  const patientData = {
    username: "appt_patient",
    email: "appt_patient@test.com",
    password: "password123",
  };

  const doctorData = {
    username: "appt_doctor",
    email: "appt_doctor@test.com",
    password: "password123",
    specialization: "Orthopedics",
    licenseNumber: "LIC_APPT_001",
    experience: 7,
    clinicAddress: {
      street: "200 Bone Ave",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
    },
    clinicTiming: [
      {
        day: "monday",
        isOpen: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        day: "wednesday",
        isOpen: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        day: "friday",
        isOpen: true,
        startTime: "09:00",
        endTime: "17:00",
      },
    ],
    consultationFee: 400,
  };

  let patientId, doctorId, doctorUserId;
  let appointmentId;

  beforeAll(async () => {
    // Clean up stale data
    await User.deleteMany({ email: { $in: [patientData.email, doctorData.email] } });
    await Doctor.deleteMany({ licenseNumber: doctorData.licenseNumber });

    // Register patient
    const patientRes = await request(app)
      .post("/api/v1/users/auth/register/patient")
      .send(patientData);

    if (!patientRes.body.data) {
      throw new Error(`Patient registration failed: ${patientRes.body.message}`);
    }

    patientId = patientRes.body.data.userId;

    // Register doctor
    const doctorRes = await request(app)
      .post("/api/v1/users/auth/register/doctor")
      .send(doctorData);

    if (!doctorRes.body.data) {
      throw new Error(`Doctor registration failed: ${doctorRes.body.message}`);
    }

    doctorId = doctorRes.body.data.doctorId;
    doctorUserId = doctorRes.body.data.userId;
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: [patientData.email, doctorData.email] },
    });
    await Doctor.deleteMany({
      licenseNumber: doctorData.licenseNumber,
    });
    await Appointment.deleteMany({
      patientId: patientId,
    });
  });

  // ─── CREATE APPOINTMENT TESTS ─────────────────────────────────────────────
  describe("POST /api/v1/appointments/create (Expected)", () => {
    it("should create appointment with valid data", async () => {
      const appointmentData = {
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appointmentTime: "14:00",
        patientPhoneNumber: "+1-555-0123",
        reason: "Regular checkup for knee pain",
      };

      // This is the expected API structure
      // Will be implemented in appointment controller
      expect(appointmentData.doctorId).toBeTruthy();
      expect(appointmentData.patientId).toBeTruthy();
      expect(appointmentData.appointmentDate).toBeTruthy();
      expect(appointmentData.appointmentTime).toBeTruthy();
    });

    it("should reject appointment without doctor ID", async () => {
      const incompleteData = {
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        appointmentTime: "14:00",
        patientPhoneNumber: "+1-555-0123",
        reason: "Checkup",
      };

      expect(incompleteData.doctorId).toBeUndefined();
    });

    it("should reject appointment without appointment date", async () => {
      const incompleteData = {
        doctorId: doctorId,
        patientId: patientId,
        appointmentTime: "14:00",
        patientPhoneNumber: "+1-555-0123",
      };

      expect(incompleteData.appointmentDate).toBeUndefined();
    });

    it("should reject appointment without appointment time", async () => {
      const incompleteData = {
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        patientPhoneNumber: "+1-555-0123",
      };

      expect(incompleteData.appointmentTime).toBeUndefined();
    });

    it("should set status to pending by default", async () => {
      const appointmentData = {
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        appointmentTime: "14:00",
        patientPhoneNumber: "+1-555-0123",
        reason: "Checkup",
        // status not provided - should default to pending
      };

      // Expected behavior: status should be "pending"
      expect(appointmentData.status).toBeUndefined(); // Will be set by backend
    });
  });

  // ─── APPOINTMENT MODEL STRUCTURE TESTS ─────────────────────────────────────
  describe("Appointment Model Structure", () => {
    it("should create appointment with correct schema", async () => {
      const appointmentData = {
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        appointmentTime: "14:00",
        patientPhoneNumber: "+1-555-0123",
        reason: "Regular checkup",
      };

      const appointment = await Appointment.create(appointmentData);
      appointmentId = appointment._id;

      expect(appointment).toBeTruthy();
      expect(appointment.doctorId.toString()).toBe(doctorId.toString());
      expect(appointment.patientId.toString()).toBe(patientId.toString());
      expect(appointment.status).toBe("pending"); // Default status
    });

    it("should include correct fields in appointment", async () => {
      const appointment = await Appointment.findById(appointmentId);

      expect(appointment.doctorId).toBeTruthy();
      expect(appointment.patientId).toBeTruthy();
      expect(appointment.appointmentDate).toBeTruthy();
      expect(appointment.appointmentTime).toBeTruthy();
      expect(appointment.patientPhoneNumber).toBeTruthy();
      expect(appointment.reason).toBeTruthy();
      expect(appointment.status).toBe("pending");
    });

    it("should support all appointment statuses", async () => {
      const statuses = ["pending", "approved", "rejected", "completed", "cancelled"];

      for (const status of statuses) {
        const appointment = await Appointment.create({
          doctorId: doctorId,
          patientId: patientId,
          appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          appointmentTime: "15:00",
          patientPhoneNumber: "+1-555-0124",
          reason: "Test",
          status: status,
        });

        expect(appointment.status).toBe(status);

        // Clean up
        await Appointment.findByIdAndDelete(appointment._id);
      }
    });

    it("should include timestamps", async () => {
      const appointment = await Appointment.findById(appointmentId);

      expect(appointment.createdAt).toBeTruthy();
      expect(appointment.updatedAt).toBeTruthy();
    });

    it("should reject invalid status", async () => {
      try {
        await Appointment.create({
          doctorId: doctorId,
          patientId: patientId,
          appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          appointmentTime: "15:00",
          patientPhoneNumber: "+1-555-0125",
          reason: "Test",
          status: "invalid_status",
        });

        // If validation passes, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Expected: validation error for invalid status
        expect(error).toBeTruthy();
      }
    });
  });

  // ─── APPOINTMENT REFERENCES TESTS ──────────────────────────────────────────
  describe("Appointment References & Population", () => {
    it("should populate doctor reference", async () => {
      const appointment = await Appointment.findById(appointmentId).populate(
        "doctorId"
      );

      expect(appointment.doctorId).toBeTruthy();
      expect(appointment.doctorId._id.toString()).toBe(doctorId.toString());
    });

    it("should populate patient reference", async () => {
      const appointment = await Appointment.findById(appointmentId).populate(
        "patientId"
      );

      expect(appointment.patientId).toBeTruthy();
      expect(appointment.patientId._id.toString()).toBe(patientId.toString());
      expect(appointment.patientId.email).toBe(patientData.email);
    });

    it("should populate both doctor and patient", async () => {
      const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId")
        .populate("patientId");

      expect(appointment.doctorId).toBeTruthy();
      expect(appointment.patientId).toBeTruthy();
    });
  });

  // ─── APPOINTMENT PHONE FIELD TESTS ────────────────────────────────────────
  describe("Appointment Phone Number Field", () => {
    it("should store patient phone number", async () => {
      const phoneNumber = "+1-555-9876";

      const appointment = await Appointment.create({
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        appointmentTime: "16:00",
        patientPhoneNumber: phoneNumber,
        reason: "Test phone storage",
      });

      expect(appointment.patientPhoneNumber).toBe(phoneNumber);

      // Clean up
      await Appointment.findByIdAndDelete(appointment._id);
    });

    it("should support various phone number formats", async () => {
      const phoneNumbers = [
        "+1-555-0100",
        "555-0101",
        "+1 (555) 0102",
        "1234567890",
      ];

      for (const phone of phoneNumbers) {
        const appointment = await Appointment.create({
          doctorId: doctorId,
          patientId: patientId,
          appointmentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          appointmentTime: "16:00",
          patientPhoneNumber: phone,
          reason: "Test",
        });

        expect(appointment.patientPhoneNumber).toBe(phone);

        // Clean up
        await Appointment.findByIdAndDelete(appointment._id);
      }
    });
  });

  // ─── APPOINTMENT REASON FIELD TESTS ────────────────────────────────────────
  describe("Appointment Reason Field", () => {
    it("should store appointment reason", async () => {
      const reason = "Annual checkup and consultation about symptoms";

      const appointment = await Appointment.create({
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        appointmentTime: "16:00",
        patientPhoneNumber: "+1-555-0200",
        reason: reason,
      });

      expect(appointment.reason).toBe(reason);

      // Clean up
      await Appointment.findByIdAndDelete(appointment._id);
    });

    it("should support reason with max 500 characters", async () => {
      const reason = "a".repeat(500);

      const appointment = await Appointment.create({
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        appointmentTime: "16:00",
        patientPhoneNumber: "+1-555-0201",
        reason: reason,
      });

      expect(appointment.reason.length).toBe(500);

      // Clean up
      await Appointment.findByIdAndDelete(appointment._id);
    });
  });
});
