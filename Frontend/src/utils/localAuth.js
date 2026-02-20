// src/utils/localAuth.js

const USERS_KEY = "users";
const DOCTORS_KEY = "doctors";
const LOGGED_IN_KEY = "loggedInUser";
const APPOINTMENTS_KEY = "appointments";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

function getDoctors() {
  try {
    return JSON.parse(localStorage.getItem(DOCTORS_KEY)) || [];
  } catch (error) {
    console.error('Error reading doctors from localStorage:', error);
    return [];
  }
}

function getAppointments() {
  try {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];
  } catch (error) {
    console.error('Error reading appointments from localStorage:', error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

function saveDoctors(doctors) {
  try {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
  } catch (error) {
    console.error('Error saving doctors to localStorage:', error);
  }
}

function saveAppointments(appointments) {
  try {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointments to localStorage:', error);
  }
}

// User Registration
export function registerUser({ name, email, password, dob, gender, bloodGroup }) {
  try {
    // Validate input data
    if (!name || !email || !password || !dob || !gender || !bloodGroup) {
      return { success: false, message: "All fields are required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    // Validate password length
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    // Validate name length
    if (name.trim().length < 2) {
      return { success: false, message: "Name must be at least 2 characters long." };
    }

    // Validate date of birth
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      return { success: false, message: "Please enter a valid date of birth (age 13-120)." };
    }

    const users = getUsers();
    const doctors = getDoctors();
    
    // Check if email already exists in users
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Check if email already exists in doctors
    const existingDoctor = doctors.find(doctor => doctor.email.toLowerCase() === email.toLowerCase());
    if (existingDoctor) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      dob,
      gender,
      bloodGroup,
      userType: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    
    try {
      localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error saving logged in user:', error);
      return { success: false, message: "Error saving user session. Please try again." };
    }
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: "An error occurred during registration. Please try again." };
  }
}

// Doctor Registration
export function registerDoctor({ name, email, password, address, specialty, clinicTiming }) {
  try {
    console.log('Doctor registration attempt:', { name, email, address, specialty, clinicTiming });
    
    // Validate input data
    if (!name || !email || !password || !address || !specialty || !clinicTiming) {
      console.log('Doctor registration failed: Missing required fields');
      return { success: false, message: "All fields are required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Doctor registration failed: Invalid email format');
      return { success: false, message: "Please enter a valid email address." };
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Doctor registration failed: Password too short');
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    // Validate name length
    if (name.trim().length < 2) {
      console.log('Doctor registration failed: Name too short');
      return { success: false, message: "Name must be at least 2 characters long." };
    }

    const users = getUsers();
    const doctors = getDoctors();
    
    console.log('Current users in storage:', users.length);
    console.log('Current doctors in storage:', doctors.length);
    
    // Check if email already exists in users
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log('Doctor registration failed: Email exists in users');
      return { success: false, message: "An account with this email already exists." };
    }

    // Check if email already exists in doctors
    const existingDoctor = doctors.find(doctor => doctor.email.toLowerCase() === email.toLowerCase());
    if (existingDoctor) {
      console.log('Doctor registration failed: Email exists in doctors');
      return { success: false, message: "An account with this email already exists." };
    }

    const newDoctor = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      address: address.trim(),
      specialty: specialty.trim(),
      clinicTiming: clinicTiming.trim(),
      userType: 'doctor',
      createdAt: new Date().toISOString(),
    };

    console.log('New doctor object created:', newDoctor);

    doctors.push(newDoctor);
    saveDoctors(doctors);
    
    console.log('Doctor saved to storage. Total doctors now:', doctors.length);
    
    try {
      localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(newDoctor));
      console.log('Doctor logged in successfully');
    } catch (error) {
      console.error('Error saving logged in doctor:', error);
      return { success: false, message: "Error saving doctor session. Please try again." };
    }
    
    return { success: true, user: newDoctor };
  } catch (error) {
    console.error('Doctor registration error:', error);
    return { success: false, message: "An error occurred during registration. Please try again." };
  }
}

// Debug function to check localStorage contents
export function debugStorage() {
  try {
    const users = getUsers();
    const doctors = getDoctors();
    const loggedInUser = getLoggedInUser();
    
    console.log('=== STORAGE DEBUG ===');
    console.log('Users in storage:', users);
    console.log('Doctors in storage:', doctors);
    console.log('Currently logged in:', loggedInUser);
    console.log('=====================');
    
    return { users, doctors, loggedInUser };
  } catch (error) {
    console.error('Debug storage error:', error);
    return null;
  }
}

// Universal Login (for both users and doctors)
export function loginUser({ email, password }) {
  try {
    console.log('Login attempt for email:', email);
    
    // Debug current storage
    debugStorage();
    
    // Validate input data
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return { success: false, message: "Email and password are required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Login failed: Invalid email format');
      return { success: false, message: "Please enter a valid email address." };
    }

    const users = getUsers();
    const doctors = getDoctors();
    
    console.log('Total users in storage:', users.length);
    console.log('Total doctors in storage:', doctors.length);
    
    // Check in users first
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      console.log('User found and authenticated:', user.userType);
      try {
        localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving logged in user:', error);
        return { success: false, message: "Error saving user session. Please try again." };
      }
      return { success: true, user };
    }

    // Check in doctors
    const doctor = doctors.find(d => d.email.toLowerCase() === email.toLowerCase() && d.password === password);
    if (doctor) {
      console.log('Doctor found and authenticated:', doctor.userType);
      try {
        localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(doctor));
      } catch (error) {
        console.error('Error saving logged in doctor:', error);
        return { success: false, message: "Error saving doctor session. Please try again." };
      }
      return { success: true, user: doctor };
    }

    console.log('Login failed: No matching user or doctor found');
    console.log('Searched email:', email.toLowerCase());
    console.log('Available user emails:', users.map(u => u.email.toLowerCase()));
    console.log('Available doctor emails:', doctors.map(d => d.email.toLowerCase()));
    
    return { success: false, message: "Invalid email or password. Please check your credentials." };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: "An error occurred during login. Please try again." };
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(LOGGED_IN_KEY);
  } catch (error) {
    console.error('Error removing logged in user:', error);
  }
}

export function getLoggedInUser() {
  try {
    const user = JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
    return user;
  } catch (error) {
    console.error('Error reading logged in user from localStorage:', error);
    return null;
  }
}

// Helper function to check if user exists
export function checkUserExists(email) {
  try {
    const users = getUsers();
    const doctors = getDoctors();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase()) ||
           doctors.some(doctor => doctor.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

// Helper function to get user by email
export function getUserByEmail(email) {
  try {
    const users = getUsers();
    const doctors = getDoctors();
    
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (user) return user;
    
    const doctor = doctors.find(doctor => doctor.email.toLowerCase() === email.toLowerCase());
    if (doctor) return doctor;
    
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Appointment Management Functions
export function getAllDoctors() {
  return getDoctors();
}

// Initialize sample doctors for testing
export function initializeSampleDoctors() {
  try {
    const doctors = getDoctors();
    
    // Only add sample doctors if no doctors exist
    if (doctors.length === 0) {
      const sampleDoctors = [
        {
          id: crypto.randomUUID(),
          name: "Dr. Emily Carter",
          email: "emily.carter@healthcare.com",
          password: "password123",
          address: "Downtown Medical Center, 123 Main St",
          specialty: "Cardiologist",
          clinicTiming: "Mon-Fri 9:00 AM - 5:00 PM",
          userType: 'doctor',
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          name: "Dr. Michael Chen",
          email: "michael.chen@healthcare.com",
          password: "password123",
          address: "Skin Care Clinic, 456 Oak Ave",
          specialty: "Dermatologist",
          clinicTiming: "Mon-Sat 10:00 AM - 6:00 PM",
          userType: 'doctor',
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@healthcare.com",
          password: "password123",
          address: "Neuro Wellness Center, 789 Pine Rd",
          specialty: "Neurologist",
          clinicTiming: "Tue-Thu 8:00 AM - 4:00 PM",
          userType: 'doctor',
          createdAt: new Date().toISOString(),
        }
      ];
      
      saveDoctors(sampleDoctors);
      console.log('Sample doctors initialized:', sampleDoctors.length);
    }
  } catch (error) {
    console.error('Error initializing sample doctors:', error);
  }
}

export function bookAppointment({ doctorId, patientId, patientName, date, time, reason }) {
  try {
    const appointments = getAppointments();
    
    const newAppointment = {
      id: crypto.randomUUID(),
      doctorId,
      patientId,
      patientName,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    appointments.push(newAppointment);
    saveAppointments(appointments);
    
    console.log('Appointment booked:', newAppointment);
    return { success: true, appointment: newAppointment };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { success: false, message: "Error booking appointment. Please try again." };
  }
}

export function getAppointmentsForDoctor(doctorId) {
  try {
    const appointments = getAppointments();
    return appointments.filter(apt => apt.doctorId === doctorId);
  } catch (error) {
    console.error('Error getting appointments for doctor:', error);
    return [];
  }
}

export function getAppointmentsForPatient(patientId) {
  try {
    const appointments = getAppointments();
    return appointments.filter(apt => apt.patientId === patientId);
  } catch (error) {
    console.error('Error getting appointments for patient:', error);
    return [];
  }
}

export function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const appointments = getAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return { success: false, message: "Appointment not found." };
    }
    
    appointments[appointmentIndex].status = newStatus;
    appointments[appointmentIndex].updatedAt = new Date().toISOString();
    
    saveAppointments(appointments);
    
    console.log('Appointment status updated:', appointments[appointmentIndex]);
    return { success: true, appointment: appointments[appointmentIndex] };
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return { success: false, message: "Error updating appointment status. Please try again." };
  }
} 