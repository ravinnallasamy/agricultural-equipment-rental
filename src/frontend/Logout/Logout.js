// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage and redirect
    localStorage.clear();

    // Show logout message briefly before redirecting
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, [navigate]);

  return (
    <div style={{
      padding: "50px",
      textAlign: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>✅ Logged Out Successfully</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          You have been safely logged out. Your session and cookies have been cleared.
        </p>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}
