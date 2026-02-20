import { createSlice } from '@reduxjs/toolkit';

// Load medications from localStorage or use default
const loadMedicationsFromStorage = () => {
  try {
    const stored = localStorage.getItem('medications');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'Metformin', dose: '500mg', meal: 'Breakfast', time: '08:00', instructions: 'Take with food.', taken: true },
      { id: 2, name: 'Lisinopril', dose: '10mg', meal: 'Breakfast', time: '08:00', instructions: 'Stay hydrated.', taken: false },
      { id: 3, name: 'Atorvastatin', dose: '20mg', meal: 'Dinner', time: '20:00', instructions: 'Best taken in the evening.', taken: false },
    ];
  } catch (error) {
    console.error('Error loading medications from localStorage:', error);
    return [
      { id: 1, name: 'Metformin', dose: '500mg', meal: 'Breakfast', time: '08:00', instructions: 'Take with food.', taken: true },
      { id: 2, name: 'Lisinopril', dose: '10mg', meal: 'Breakfast', time: '08:00', instructions: 'Stay hydrated.', taken: false },
      { id: 3, name: 'Atorvastatin', dose: '20mg', meal: 'Dinner', time: '20:00', instructions: 'Best taken in the evening.', taken: false },
    ];
  }
};

const initialState = {
  medications: loadMedicationsFromStorage(),
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    addMedication: (state, action) => {
      const newMedication = {
        ...action.payload,
        id: Date.now(),
        taken: false,
      };
      state.medications.push(newMedication);
    },
    updateMedication: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.medications.findIndex(med => med.id === id);
      if (index !== -1) {
        state.medications[index] = { ...state.medications[index], ...updates };
      }
    },
    markAsTaken: (state, action) => {
      const id = action.payload;
      const medication = state.medications.find(med => med.id === id);
      if (medication) {
        medication.taken = true;
      }
    },
    markAsNotTaken: (state, action) => {
      const id = action.payload;
      const medication = state.medications.find(med => med.id === id);
      if (medication) {
        medication.taken = false;
      }
    },
    deleteMedication: (state, action) => {
      const id = action.payload;
      state.medications = state.medications.filter(med => med.id !== id);
    },
    resetDailyMedications: (state) => {
      state.medications.forEach(medication => {
        medication.taken = false;
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addMedication,
  updateMedication,
  markAsTaken,
  markAsNotTaken,
  deleteMedication,
  resetDailyMedications,
  setLoading,
  setError,
  clearError,
} = medicationSlice.actions;

// Selectors
export const selectAllMedications = (state) => state.medications.medications;
export const selectTakenMedications = (state) => state.medications.medications.filter(med => med.taken);
export const selectPendingMedications = (state) => state.medications.medications.filter(med => !med.taken);
export const selectAdherencePercentage = (state) => {
  const medications = state.medications.medications;
  if (medications.length === 0) return 0;
  const takenCount = medications.filter(med => med.taken).length;
  return (takenCount / medications.length) * 100;
};
export const selectUpcomingMedication = (state) => {
  const pendingMeds = state.medications.medications.filter(med => !med.taken);
  return pendingMeds.sort((a, b) => a.time.localeCompare(b.time))[0];
};
export const selectLoading = (state) => state.medications.loading;
export const selectError = (state) => state.medications.error;

export default medicationSlice.reducer; 