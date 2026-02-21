import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, BarChart3 } from "lucide-react";
import { logout } from "../store/authSlice.js"; // Make sure this exists

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Dispatch logout action to Redux
    dispatch(logout());

    // Close dropdown
    setIsOpen(false);

    // Redirect to home
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const userInitials = (user.username || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const profileLink =
    user.usertype === "doctor"
      ? "/doctor/appointments"
      : "/main";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
        title={user.username}
      >
        {userInitials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-200">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.username}</p>
                <p className="text-xs text-white/80 capitalize">{user.usertype}</p>
                <p className="text-xs text-white/70 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 border-b border-slate-100">
            <button
              onClick={() => {
                navigate(profileLink);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <User size={16} className="text-blue-600" />
              <span>My Profile</span>
            </button>

            {user.usertype === "patient" && (
              <button
                onClick={() => {
                  navigate("/fitness-dashboard");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <BarChart3 size={16} className="text-emerald-600" />
                <span>Health Dashboard</span>
              </button>
            )}

            <button
              onClick={() => {
                // Navigate to settings page (create if needed)
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Settings size={16} className="text-amber-600" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-lg font-semibold"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Version Info */}
          <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-100">
            PulseIQ v1.0
          </div>
        </div>
      )}
    </div>
  );
}