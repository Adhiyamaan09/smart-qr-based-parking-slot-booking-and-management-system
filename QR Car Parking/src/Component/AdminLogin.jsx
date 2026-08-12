import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import parkingAnimation from '../assets/animation.json'; // Adjust path if needed

const AdminLogin = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3006/admin/adminlogin', values)
            .then(result => {
                if (result.data.Status) {
                    localStorage.setItem("admin_valid", "true");
                    localStorage.setItem("admin_token", result.data.Token);
                    navigate('/admin/dashboard');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log("Admin Login Error:", err));
    };

    return (
        <div className="loginPage">
            {/* 🔁 Lottie Background */}
            <Lottie
                animationData={parkingAnimation}
                loop={true}
                autoplay
                style={{
                    position: "absolute",
                    width: "200vw",
                    height: "200vh",
                    top: "-50%",
                    left: "-50%",
                    zIndex: 0,
                    pointerEvents: "none"
                }}
            />

            {/* 🔐 Admin Login Form */}
            <div className="p-3 rounded border loginForm">
                <div className="text-danger">{error && error}</div>
                <h2 className="text-center mb-3">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Enter admin email"
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter admin password"
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className="form-control rounded-0"
                        />
                    </div>
                    <button className="btn btn-primary w-100 rounded-5 mt-3">Log In</button>
                </form>
                <p className="mt-3">Not an Admin? <Link to="/userlogin">User Login</Link></p>
            </div>
        </div>
    );
};

export default AdminLogin;
