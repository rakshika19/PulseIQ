import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../store/authSlice.js";

const MainHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch current user data on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      if (!user || !user.username) {
        dispatch(getCurrentUser());
      }
    }
  }, [dispatch]);

  // Get user's name (backend returns username field)
  const userName = user?.username || 'User';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/auth?mode=login', { replace: true });
  };
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "Segoe UI, sans-serif",
      background: "#f5f7fb",
    },
    sidebar: {
      width: "250px",
      background: "#fff",
      padding: "20px",
      borderRight: "1px solid #eee",
    },
    logo: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    section: {
      fontSize: "12px",
      color: "gray",
      margin: "20px 0 10px",
    },
    link: {
      display: "block",
      padding: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      color: "#333",
      marginBottom: "5px",
    },
    activeLink: {
      background: "#3b82f6",
      color: "white",
    },
    main: {
      flex: 1,
      padding: "60px",
      textAlign: "center",
    },
    title: {
      fontSize: "48px",
      fontWeight: "bold",
    },
    highlight: {
      color: "#2563eb",
    },
    subtitle: {
      marginTop: "20px",
      color: "#555",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: "1.6",
    },
    buttonContainer: {
      marginTop: "30px",
    },
    primaryBtn: {
      padding: "12px 24px",
      margin: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
    },
    secondaryBtn: {
      padding: "12px 24px",
      margin: "10px",
      borderRadius: "8px",
      border: "2px solid #2563eb",
      background: "transparent",
      color: "#2563eb",
      fontSize: "16px",
      cursor: "pointer",
    },
    stats: {
      display: "flex",
      justifyContent: "center",
      gap: "60px",
      marginTop: "80px",
      flexWrap: "wrap",
    },
    statBox: {
      textAlign: "center",
    },
    statNumber: {
      fontSize: "28px",
      fontWeight: "bold",
    },
    statLabel: {
      color: "gray",
    },
  };

  const SidebarLink = ({ children, active }) => (
    <div style={{ ...styles.link, ...(active ? styles.activeLink : {}) }}>
      {children}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>HealthCare</div>
        {user && (
          <div style={{ 
            padding: "10px", 
            marginBottom: "20px", 
            background: "#f0f4f8", 
            borderRadius: "8px",
            fontSize: "14px",
            color: "#2563eb",
            fontWeight: "600"
          }}>
            Welcome, {userName}!
          </div>
        )}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              borderRadius: "8px",
              border: "1px solid #dc2626",
              background: "transparent",
              color: "#dc2626",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>
        )}

        <p style={styles.section}>MAIN</p>
        <SidebarLink active>Home</SidebarLink>
        <SidebarLink>Appointments</SidebarLink>
        <SidebarLink>Medical Records</SidebarLink>
        <SidebarLink>Profile</SidebarLink>

        <p style={styles.section}>AI FEATURES</p>
        <SidebarLink>Disease Detector</SidebarLink>
        <SidebarLink>Predictive Risk Scoring</SidebarLink>
        <SidebarLink>Smart Care Plan Generator</SidebarLink>
        <SidebarLink>PDF Summarizer</SidebarLink>

        <p style={styles.section}>CHATBOTS</p>
        <SidebarLink>Medical Chatbot</SidebarLink>
        <SidebarLink>Mental Health Chatbot</SidebarLink>
        <SidebarLink>Voice Health Assistant</SidebarLink>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {user && (
          <div style={{
            marginBottom: "20px",
            fontSize: "24px",
            color: "#2563eb",
            fontWeight: "600"
          }}>
            Welcome back, {userName}! 👋
          </div>
        )}
        <h1 style={styles.title}>
          Your Health, <span style={styles.highlight}>Reimagined</span>
        </h1>

        <p style={styles.subtitle}>
          Experience the future of healthcare with 16 AI-powered features
          designed to support every aspect of your health journey. From symptom
          analysis to medication management, we've got you covered.
        </p>

        <div style={styles.buttonContainer}>
          <button style={styles.primaryBtn}>Start AI Chat</button>
          <button style={styles.secondaryBtn}>Book Appointment</button>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Patients Helped</div>
          </div>

          <div style={styles.statBox}>
            <div style={styles.statNumber}>1,200+</div>
            <div style={styles.statLabel}>Medical Professionals</div>
          </div>

          <div style={styles.statBox}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>AI Support</div>
          </div>

          <div style={styles.statBox}>
            <div style={styles.statNumber}>16</div>
            <div style={styles.statLabel}>AI Features</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainHome;