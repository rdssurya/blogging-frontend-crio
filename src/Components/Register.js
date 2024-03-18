import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
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
            if(username.trim().length < 6){
                showError("Username should be atleast 6 characters long.");
            }
            else if(password.length < 6){
                showError("Password should be atleast 6 characters long.");
            }
            else{
                const userDetails = {
                    username: username,
                    email: email,
                    password: password
                };
                const response = await axios.post(`${API_BASE_URL}/users/register`, userDetails);
                if(response){
                    setSuccessMessage(response.data.message);
                    setTimeout(()=>{
                        setSuccessMessage("");
                        navigate("/login");
                    }, 2000);
                }
            }
        } catch (error) {
            showError(error?.response?.data?.message || error.message);
        }
    };

  return (
    <div style={{width: "100vw", height:"100vh", display: 'flex', flexDirection:'column'}}>
        <form onSubmit={handleSubmit} style={{margin: 'auto', width: '300px', border:"1px solid gray", display: 'flex', flexDirection:'column', gap: "10px", padding: "10px"}}>
            <label>Username</label>
            <input type='text' required value={username} onChange={(e) => setUsername(e.target.value)}/>
            <label>Email</label>
            <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Password</label>
            <input type='password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>
                Register
            </button>
            {successMessage && <span style={{color:"green"}}>{successMessage}</span>}
            {errorMessage && <span style={{color:"red"}}>{errorMessage}</span>}
            <span>
                Already have an account?
                <span style={{color:"orange", cursor:"pointer"}} onClick={()=>navigate('/login')}>
                    Login here
                </span>
            </span>
        </form>
    </div>
  );
};

export default Register;