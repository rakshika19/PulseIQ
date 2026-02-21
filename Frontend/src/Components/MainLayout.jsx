import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  
  // Hide sidebar if user is a doctor
  const isDoctor = user?.role === 'doctor' || user?.userType === 'doctor';

  return (
    <div className="h-screen bg-slate-50 flex">
      {/* ── Sidebar (Hidden for Doctors) ── */}
      {!isDoctor && <Sidebar />}

      {/* ── Page Content ── */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}