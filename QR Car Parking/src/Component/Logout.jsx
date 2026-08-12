import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3006/auth/logout')
            .then(() => {
                localStorage.removeItem("valid"); // Remove authentication flag
                navigate('/login'); // Redirect to login page
            })
            .catch(err => console.error("Logout Error:", err));
    }, [navigate]);

    return (
        <div className='logoutPage d-flex justify-content-center align-items-center vh-100'>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;  // ✅ Ensure this export statement is present
