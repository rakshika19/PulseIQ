import { useState } from "react";
import {
  CalendarCheck,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Bell,
  Sparkles,
  ChevronLeft,
  Phone,
  FileText,
  MessageSquare,
  X,
  AlertCircle,
  Calendar,
  Users,
  TrendingUp,
  Edit3,
  Save,
  Plus,
  Trash2,
  Settings,
  CheckCheck,
} from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const BOOKINGS = [
  {
    id: "APT-001",
    patient: "Sarah Mitchell",
    age: 34,
    gender: "Female",
    phone: "+91 98765 43210",
    avatar: "SM",
    avatarBg: "from-rose-400 to-pink-500",
    reason: "Experiencing chest tightness and occasional shortness of breath for the past 3 days. Also noticed mild palpitations during evening hours.",
    date: "Today",
    dateISO: "Feb 19, 2026",
    time: "3:00 PM",
    type: "video",
    status: "accepted",
    fee: 800,
    riskLevel: "Medium",
    riskColor: "bg-amber-100 text-amber-700",
    aiFlag: "Possible cardiac involvement — review recommended",
    requestedAt: "2 hrs ago",
  },
  {
    id: "APT-002",
    patient: "Rahul Verma",
    age: 42,
    gender: "Male",
    phone: "+91 99123 45678",
    avatar: "RV",
    avatarBg: "from-blue-400 to-indigo-500",
    reason: "Follow-up on recent ECG report. Wants to discuss medication dosage for hypertension management.",
    date: "Today",
    dateISO: "Feb 19, 2026",
    time: "5:30 PM",
    type: "clinic",
    status: "accepted",
    fee: 800,
    riskLevel: "High",
    riskColor: "bg-red-100 text-red-600",
    aiFlag: "High cardiovascular risk — prioritise",
    requestedAt: "45 min ago",
  },
  {
    id: "APT-003",
    patient: "Meera Nair",
    age: 28,
    gender: "Female",
    phone: "+91 97654 32109",
    avatar: "MN",
    avatarBg: "from-purple-400 to-violet-500",
    reason: "Routine annual health check. No specific complaints. Wants preventive cardiac screening as family has history of heart disease.",
    date: "Tomorrow",
    dateISO: "Feb 20, 2026",
    time: "10:00 AM",
    type: "video",
    status: "accepted",
    fee: 800,
    riskLevel: "Low",
    riskColor: "bg-emerald-100 text-emerald-700",
    aiFlag: "Family history detected — preventive screening suggested",
    requestedAt: "3 hrs ago",
  },
  {
    id: "APT-004",
    patient: "Arjun Kapoor",
    age: 56,
    gender: "Male",
    phone: "+91 91234 56789",
    avatar: "AK",
    avatarBg: "from-amber-400 to-orange-500",
    reason: "Persistent fatigue, mild swelling in legs, and dizziness on standing up. On medication for Type 2 Diabetes.",
    date: "Feb 21, 2026",
    dateISO: "Feb 21, 2026",
    time: "11:30 AM",
    type: "clinic",
    status: "accepted",
    fee: 800,
    riskLevel: "High",
    riskColor: "bg-red-100 text-red-600",
    aiFlag: "Possible HF symptoms — urgent review",
    requestedAt: "1 day ago",
  },
  {
    id: "APT-005",
    patient: "Priya Desai",
    age: 38,
    gender: "Female",
    phone: "+91 88765 43210",
    avatar: "PD",
    avatarBg: "from-emerald-400 to-teal-500",
    reason: "Complaints of irregular heartbeat for 2 weeks. Holter monitor report attached. No significant past cardiac history.",
    date: "Feb 22, 2026",
    dateISO: "Feb 22, 2026",
    time: "2:00 PM",
    type: "video",
    status: "accepted",
    fee: 800,
    riskLevel: "Medium",
    riskColor: "bg-amber-100 text-amber-700",
    aiFlag: "Arrhythmia pattern detected in uploaded report",
    requestedAt: "1 day ago",
  },
  {
    id: "APT-006",
    patient: "Kiran Shetty",
    age: 64,
    gender: "Male",
    phone: "+91 70123 45678",
    avatar: "KS",
    avatarBg: "from-cyan-400 to-blue-500",
    reason: "Annual cardiac checkup. History of MI in 2019. Currently on aspirin and statins. No recent complaints.",
    date: "Feb 23, 2026",
    dateISO: "Feb 23, 2026",
    time: "9:00 AM",
    type: "clinic",
    status: "completed",
    fee: 800,
    riskLevel: "High",
    riskColor: "bg-red-100 text-red-600",
    aiFlag: "Post-MI patient — high priority monitoring",
    requestedAt: "2 days ago",
  },
];

const DEFAULT_AVAILABILITY = [
  { id: 1, day: "Monday",    active: true,  slots: ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"] },
  { id: 2, day: "Tuesday",   active: true,  slots: ["10:00 AM", "11:00 AM", "2:00 PM", "5:00 PM"] },
  { id: 3, day: "Wednesday", active: false, slots: [] },
  { id: 4, day: "Thursday",  active: true,  slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
  { id: 5, day: "Friday",    active: true,  slots: ["10:00 AM", "2:00 PM", "4:00 PM", "5:30 PM"] },
  { id: 6, day: "Saturday",  active: true,  slots: ["9:00 AM", "10:00 AM"] },
  { id: 7, day: "Sunday",    active: false, slots: [] },
];

const TIME_OPTIONS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM",
];

const STATUS_TABS = ["All", "Accepted", "Completed"];

const STATS = [
  { label: "Total Bookings", value: "6",  icon: Users,        color: "text-blue-600",    bg: "bg-blue-50"    },
  { label: "Upcoming",       value: "5",  icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50"   },
  { label: "Completed",      value: "1",  icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "This Week",      value: "6",  icon: TrendingUp,   color: "text-violet-600",  bg: "bg-violet-50"  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    accepted:  { label: "Upcoming",   cls: "bg-blue-100 text-blue-700"       },
    completed: { label: "Completed",  cls: "bg-emerald-100 text-emerald-700" },
  };
  const { label, cls } = map[status] || {};
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
}

// ─── Availability Modal ───────────────────────────────────────────────────────

function AvailabilityModal({ onClose }) {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [newSlot, setNewSlot] = useState({});
  const [saved, setSaved] = useState(false);

  const toggleDay = (id) => {
    setAvailability((prev) =>
      prev.map((d) => d.id === id ? { ...d, active: !d.active, slots: d.active ? [] : d.slots } : d)
    );
  };

  const addSlot = (id) => {
    const time = newSlot[id];
    if (!time) return;
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (d.slots.includes(time)) return d;
        return { ...d, slots: [...d.slots, time].sort() };
      })
    );
    setNewSlot((prev) => ({ ...prev, [id]: "" }));
  };

  const removeSlot = (dayId, slot) => {
    setAvailability((prev) =>
      prev.map((d) => d.id === dayId ? { ...d, slots: d.slots.filter((s) => s !== slot) } : d)
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 rounded-t-3xl px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <Settings size={15} className="text-violet-600" />
            </div>
            <div>
              <p className="text-slate-900 font-bold">Edit Availability</p>
              <p className="text-slate-400 text-xs">Set your weekly schedule & time slots</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {availability.map((day) => (
            <div key={day.id} className={`border rounded-2xl transition-all ${day.active ? "border-blue-100 bg-blue-50/30" : "border-slate-100 bg-slate-50/50"}`}>
              {/* Day header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day.id)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${day.active ? "bg-blue-500" : "bg-slate-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${day.active ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className={`font-bold text-sm ${day.active ? "text-slate-800" : "text-slate-400"}`}>{day.day}</span>
                </div>
                {day.active && (
                  <span className="text-xs text-slate-500 font-medium">{day.slots.length} slot{day.slots.length !== 1 ? "s" : ""}</span>
                )}
                {!day.active && (
                  <span className="text-xs text-slate-400 font-medium italic">Unavailable</span>
                )}
              </div>

              {/* Slots */}
              {day.active && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Existing slots */}
                  {day.slots.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot) => (
                        <div key={slot} className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                          <Clock size={10} className="text-blue-400" />
                          {slot}
                          <button onClick={() => removeSlot(day.id, slot)} className="text-blue-300 hover:text-red-400 transition-colors ml-0.5">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {day.slots.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No slots added. Add a time slot below.</p>
                  )}
                  {/* Add slot */}
                  <div className="flex items-center gap-2">
                    <select
                      value={newSlot[day.id] || ""}
                      onChange={(e) => setNewSlot((prev) => ({ ...prev, [day.id]: e.target.value }))}
                      className="flex-1 border border-slate-200 rounded-xl text-xs text-slate-700 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                      <option value="">Select time slot</option>
                      {TIME_OPTIONS.filter((t) => !day.slots.includes(t)).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => addSlot(day.id)}
                      disabled={!newSlot[day.id]}
                      className="flex items-center gap-1.5 bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all hover:bg-blue-700 disabled:cursor-not-allowed"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 rounded-b-3xl px-6 py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${saved ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"}`}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Availability</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ booking, onClose, onMarkComplete }) {
  const [note, setNote] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);
  const isAccepted = booking.status === "accepted";
  const isCompleted = booking.status === "completed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 rounded-t-3xl px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-slate-900 font-bold">Appointment Details</p>
            <p className="text-slate-400 text-xs mt-0.5">{booking.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors ml-1">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Patient info */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${booking.avatarBg} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm`}>
              {booking.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-bold">{booking.patient}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{booking.age} yrs · {booking.gender}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Phone size={11} className="text-slate-400" />
                <span className="text-slate-500 text-xs">{booking.phone}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${booking.riskColor}`}>
              {booking.riskLevel} Risk
            </span>
          </div>

          {/* Appointment details */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Calendar,                                              label: "Date",  value: booking.dateISO },
              { Icon: Clock,                                                 label: "Time",  value: booking.time },
              { Icon: booking.type === "video" ? Video : Building2,         label: "Mode",  value: booking.type === "video" ? "Video Call" : "Clinic" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <Icon size={14} className="text-blue-500 mx-auto mb-1" />
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-slate-800 font-bold text-xs mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* AI flag */}
          <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
            <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-700 text-xs font-bold mb-0.5">AI Health Insight</p>
              <p className="text-amber-700 text-xs leading-relaxed">{booking.aiFlag}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={13} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reason for Visit</p>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-4">{booking.reason}</p>
          </div>

          {/* Fee */}
          <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-slate-600 text-sm font-medium">Consultation Fee</span>
            <span className="text-blue-700 font-extrabold text-base">₹{booking.fee}</span>
          </div>

          {/* Completion note */}
          {showNoteBox && (
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">
                Consultation Notes (optional)
              </label>
              <div className="relative">
                <MessageSquare size={13} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add any clinical notes or follow-up instructions..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 resize-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {isAccepted && (
            <div className="flex gap-3 pt-1">
              {!showNoteBox ? (
                <button
                  onClick={() => setShowNoteBox(true)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCheck size={15} /> Mark as Completed
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowNoteBox(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onMarkComplete(booking.id, note)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCheck size={15} /> Confirm Complete
                  </button>
                </>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2">
              <CheckCheck size={15} /> Appointment Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onView, onMarkComplete }) {
  const isAccepted = booking.status === "accepted";
  const isCompleted = booking.status === "completed";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 p-5 ${isCompleted ? "border-emerald-100 opacity-80" : "border-blue-100"}`}>
      <div className="flex items-start gap-4">
        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${booking.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
          {booking.avatar}
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <CheckCheck size={9} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-slate-900 font-bold text-sm">{booking.patient}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{booking.age} yrs · {booking.gender}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.riskColor}`}>{booking.riskLevel} Risk</span>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={11} /> {booking.date}, {booking.time}</span>
            <span className="flex items-center gap-1">
              {booking.type === "video" ? <Video size={11} /> : <Building2 size={11} />}
              {booking.type === "video" ? "Video Call" : "Clinic Visit"}
            </span>
            <span className="flex items-center gap-1 text-slate-400">Requested {booking.requestedAt}</span>
          </div>

          <div className="flex items-start gap-1.5 mt-2.5 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <AlertCircle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-[11px] leading-snug">{booking.aiFlag}</p>
          </div>

          <p className="text-slate-500 text-xs mt-2.5 leading-relaxed line-clamp-2">{booking.reason}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 gap-3">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-600">₹{booking.fee}</span> · {booking.id}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(booking)}
            className="text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
          >
            View Details
          </button>
          {isAccepted && (
            <button
              onClick={() => onMarkComplete(booking.id, "")}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm"
            >
              <CheckCheck size={12} /> Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
  const isSuccess = type === "success";
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className={`bg-white border rounded-2xl shadow-2xl p-4 flex items-start gap-3 ${isSuccess ? "border-emerald-200" : "border-blue-200"}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSuccess ? "bg-emerald-50" : "bg-blue-50"}`}>
          {isSuccess ? <CheckCheck size={18} className="text-emerald-500" /> : <CheckCircle2 size={18} className="text-blue-500" />}
        </div>
        <div className="flex-1">
          <p className="text-slate-900 font-bold text-sm">{isSuccess ? "Appointment Completed" : "Availability Saved"}</p>
          <p className="text-slate-500 text-xs mt-0.5">{message}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={13} /></button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorAppointment({ doctorName = "Dr. Priya Sharma", onBack }) {
  const [bookings, setBookings] = useState(BOOKINGS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkComplete = (id, note) => {
    const b = bookings.find((b) => b.id === id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "completed" } : b));
    setSelectedBooking(null);
    showToast(`${b?.patient}'s appointment has been marked as completed.`, "success");
  };

  const filtered = bookings.filter((b) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Accepted"  && b.status === "accepted")  ||
      (activeTab === "Completed" && b.status === "completed");
    const matchSearch =
      b.patient.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.reason.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const upcomingCount = bookings.filter((b) => b.status === "accepted").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const liveStats = [
    { label: "Total Bookings", value: String(bookings.length), icon: Users,        color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Upcoming",       value: String(upcomingCount),   icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50"   },
    { label: "Completed",      value: String(completedCount),  icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "This Week",      value: String(bookings.length), icon: TrendingUp,   color: "text-violet-600",  bg: "bg-violet-50"  },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Topbar */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="text-slate-800 font-bold text-sm tracking-tight">PreventAI Health</span>
            </div>
            <span className="hidden sm:block text-slate-300">·</span>
            <span className="hidden sm:block text-slate-500 text-xs font-medium">Doctor Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Edit Availability Button */}
            <button
              onClick={() => setShowAvailability(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <Edit3 size={12} /> Edit Availability
            </button>
            <button className="relative text-slate-400 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-colors">
              <Bell size={18} />
              {upcomingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {upcomingCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                {doctorName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <span className="text-slate-700 text-sm font-medium hidden sm:block">{doctorName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
          <button
            onClick={onBack || (() => window.history.back())}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm font-semibold transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck size={18} className="text-blue-600" />
                <h1 className="text-slate-900 font-extrabold text-xl">My Appointments</h1>
              </div>
              <p className="text-slate-400 text-sm">View appointment details and mark consultations as completed</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile availability button */}
              <button
                onClick={() => setShowAvailability(true)}
                className="sm:hidden flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-2 rounded-xl transition-all"
              >
                <Edit3 size={12} /> Edit Availability
              </button>
              {upcomingCount > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex-shrink-0">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-blue-700 text-xs font-semibold">
                    {upcomingCount} upcoming appointment{upcomingCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {liveStats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={17} className={s.color} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, booking ID, or reason..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "All"
                ? bookings.length
                : bookings.filter((b) => b.status === tab.toLowerCase()).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Booking list */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onView={setSelectedBooking}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarCheck size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-700 font-semibold">No appointments found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(""); setActiveTab("All"); }} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
              Clear filters
            </button>
          </div>
        )}

      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <DetailModal
          booking={bookings.find((b) => b.id === selectedBooking.id)}
          onClose={() => setSelectedBooking(null)}
          onMarkComplete={handleMarkComplete}
        />
      )}

      {/* Availability modal */}
      {showAvailability && (
        <AvailabilityModal onClose={() => setShowAvailability(false)} />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}