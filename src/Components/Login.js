import axios from 'axios';
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(()=>{
            setErrorMessage("");
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const userDetails = {
                email: email,
                password: password
            };
            const response = await axios.post(`${API_BASE_URL}/users/login`, userDetails);
            if(response){
                setSuccessMessage("Logged in successfully!");
                localStorage.setItem("token", response?.data?.token);
                setTimeout(()=>{
                    setSuccessMessage("");
                    navigate("/blogs");
                }, 2000);
            }
        } catch (error) {
            showError(error?.response?.data?.message || error.message);
        }
    };

  return (
    <div style={{width: "100vw", height:"100vh", display: 'flex', flexDirection:'column'}}>
        <form onSubmit={handleSubmit} style={{margin: 'auto', width: '300px', border:"1px solid gray", display: 'flex', flexDirection:'column', gap: "10px", padding: "10px"}}>
            <label>Email</label>
            <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Password</label>
            <input type='password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>
                Login
            </button>
            {successMessage && <span style={{color:"green"}}>{successMessage}</span>}
            {errorMessage && <span style={{color:"red"}}>{errorMessage}</span>}
            <span>
                New User?
                <span style={{color:"orange", cursor:"pointer"}} onClick={()=>navigate('/register')}>
                   Register here
                </span>
            </span>
        </form>
    </div>
  );
};

export default Login;