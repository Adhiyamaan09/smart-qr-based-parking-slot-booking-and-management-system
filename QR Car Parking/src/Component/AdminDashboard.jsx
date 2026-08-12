import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_valid");
    localStorage.removeItem("admin_token");
    navigate('/adminlogin', { replace: true });
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff; /* White background */
          color: #333; /* Dark text color for readability */
        }

        .admin-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .admin-navbar {
          background: #000000; /* Black background for navbar */
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .admin-brand {
          font-size: 1.7rem;
          color: #ffffff; /* White text for brand */
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .admin-nav {
          display: flex;
          gap: 1.8rem;
        }

        .admin-nav a,
        .admin-nav button {
          color: #ccc; /* Light grey for links and buttons */
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .admin-nav a:hover,
        .admin-nav button:hover {
          color: #fff; /* White text on hover */
          background: #444; /* Dark background on hover */
          border-radius: 4px;
          padding: 0.5rem 1rem;
        }

        .admin-main {
          padding: 3rem 2rem;
          text-align: center;
          flex: 1;
          background: #f9f9f9; /* Slightly off-white for the main content area */
        }

        .admin-heading {
          font-size: 2.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .admin-sub {
          color: #777;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .admin-actions {
          max-width: 550px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .admin-button {
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 6px;
          border: none;
          background: #333; /* Dark button background */
          color: #fff;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .admin-button:hover {
          background: #444; /* Darker on hover */
          transform: scale(1.05);
        }

        .admin-outlet {
          margin-top: 3rem;
        }
      `}</style>

      <nav className="admin-navbar">
        <Link to="/admin/dashboard" className="admin-brand">
          <i className="bi bi-shield-lock"></i> Admin Panel
        </Link>
        <div className="admin-nav">
          <Link to="/admin/scanqr"><i className="bi bi-qr-code-scan"></i> Scan QR</Link>
          <Link to="/admin/parkinglogs"><i className="bi bi-clock-history"></i> Parking Logs</Link>
          <button onClick={handleLogout}><i className="bi bi-power"></i> Logout</button>
        </div>
      </nav>

      <main className="admin-main">
        <div className="admin-heading">Welcome, Admin</div>
        <div className="admin-sub">Manage the parking system with ease and precision.</div>

        <div className="admin-actions">
          <button className="admin-button" onClick={() => navigate('/admin/scanqr')}>
            <i className="bi bi-qr-code-scan"></i> Scan QR Code
          </button>
          <button className="admin-button" onClick={() => navigate('/admin/parkinglogs')}>
            <i className="bi bi-clock-history"></i> View Parking Logs
          </button>
          <button className="admin-button" onClick={handleLogout}>
            <i className="bi bi-power"></i> Logout
          </button>
        </div>

        <div className="admin-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;  