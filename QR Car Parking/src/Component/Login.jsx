import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from "lottie-react";
import parkingAnimation from "../assets/animation.json";

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3006/auth/userlogin', values)
            .then(result => {
                if (result.data.Status) {
                    localStorage.setItem("valid", "true");
                    localStorage.setItem("token", result.data.Token);
                    navigate('/dashboard');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log("Login Error:", err));
    };

    return (
        <div className='loginPage'>
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
    pointerEvents: "none",
  }}
/>




            <div className='loginForm'>
                <div className='text-danger'>{error && error}</div>
                <h2 className="text-center mb-3">User Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            name='email'
                            autoComplete='off'
                            placeholder='Enter email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            name='password'
                            placeholder='Enter password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>
                    <button className='btn btn-primary w-100 rounded-5 mt-3'>Log In</button>
                </form>
                <p className='mt-3'>Don't Have An Account? <Link to="/register">Register Here</Link></p>
                <p className='mt-3'>For Admin Login <Link to="/adminlogin">Click Here</Link></p>
            </div>
        </div>
    );
};

export default Login;
