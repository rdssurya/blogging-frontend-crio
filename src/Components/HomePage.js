import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
  return (
    <div style={{width: "100vw", height:"100vh", textAlign:"center"}}>
        <h2>Welcome!</h2>
        <button onClick={()=>navigate("/login")}>Login</button>
        <span> </span>
        <button onClick={()=>navigate("/register")}>Sign Up</button>
    </div>
  );
};

export default HomePage;