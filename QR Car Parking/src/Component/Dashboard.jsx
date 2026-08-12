import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("valid");
    navigate('/userlogin', { replace: true });
    window.location.reload();
  };

  return (
    <div className="user-dashboard">
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          color: #333;
        }

        .user-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .user-navbar {
          background: #1a1a1a;
          padding: 1.2rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .user-brand {
          font-size: 1.7rem;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
        }

        .user-nav {
          display: flex;
          gap: 1.5rem;
        }

        .user-nav a,
        .user-nav button {
          color: #ccc;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          text-decoration: none;
          transition: 0.3s ease;
        }

        .user-nav a:hover,
        .user-nav button:hover {
          color: #fff;
          background: #444;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }

        .user-main {
          padding: 3rem 2rem;
          text-align: center;
          flex: 1;
          background: #f9f9f9;
        }

        .user-heading {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .user-sub {
          color: #666;
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .user-actions {
          max-width: 550px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .user-button {
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 6px;
          background: #333;
          color: #fff;
          border: none;
          transition: 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
        }

        .user-button:hover {
          background: #444;
          transform: scale(1.05);
        }

        .user-outlet {
          margin-top: 3rem;
        }
      `}</style>

      <nav className="user-navbar">
        <Link to="/dashboard" className="user-brand">
          <i className="bi bi-car-front-fill"></i> Parking Slot Booking
        </Link>
        <div className="user-nav">
          <Link to="/dashboard"><i className="bi bi-speedometer2"></i> Dashboard</Link>
          <Link to="/dashboard/cost"><i className="bi bi-currency-rupee"></i> Parking Cost</Link>
          <Link to="/dashboard/bookings"><i className="bi bi-ticket-perforated"></i> My Bookings</Link>
          <button onClick={handleLogout}><i className="bi bi-power"></i> Logout</button>
        </div>
      </nav>
        <div className="user-outlet">
          <Outlet />
        </div>
    </div>
  );
};

export default Dashboard;
