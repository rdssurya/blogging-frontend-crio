import React from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/blog", {state:{blogDetails: props.blogData}});
    };

  return (
    <div style={{maxWidth: "80%", padding: "10px", border: "1px solid gray", borderRadius:"10px", wordWrap:"break-word"}}>
        <h2>Title: {props.title}</h2>
        <h4>Description: {props.description}</h4>
        <div style={{cursor:'pointer', border: "1px solid gray", borderRadius:"5px", maxWidth:"100px", textAlign: 'center', backgroundColor:"#87CEEB"}}
            onClick={handleClick}
        >
            Learn More
        </div>
    </div>
  );
};

export default Blog;