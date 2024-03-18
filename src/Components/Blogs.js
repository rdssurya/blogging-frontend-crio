import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Blog from './Blog';

const Blogs = () => {
    const navigate = useNavigate();
    const [showTextFields, setShowTextFields] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if(localStorage.getItem("token") == null){
            navigate("/login");
        }else{
            fetchBlogs();
        }
    }, [navigate]);

    const showError = (message) => {
        setError(message);
        setTimeout(()=>{
            setError("");
        },2000);
    }

    const fetchBlogs = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_BASE_URL}/blogs`,{
                headers: {
                  Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setBlogs(response.data);
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error");
        }
    };

    const addBlog = async () => {
        const token = localStorage.getItem("token");
        try {
            if(title.trim().length === 0){
                showError("Title cannot be empty.");
            }
            else if(description.trim().length < 20){
                showError("Description must be atleast 20 characters long.");
            }
            else{
                const blogDetails = {
                    title: title.trim(),
                    description: description.trim()
                }
                const response = await axios.post(`${API_BASE_URL}/blogs`, blogDetails,{
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 201){
                    setShowTextFields(false);
                    fetchBlogs();
                }
            }
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message || "Network Error. Please try again!");
        }
    };

  return (
    <div style={{width: "100vw", minHeight: "100vh", display: "flex", flexDirection:"column",gap: "10px", padding: "20px"}}>
        {error && <span style={{color:"red"}}>{error}</span>}
        {!showTextFields && <button onClick={()=>setShowTextFields(true)} style={{maxWidth:"150px"}}>Add new Blog</button>}
        {
            showTextFields && <>
            <div>Title: <input type='text' value={title} onChange={(e) => setTitle(e.target.value)}/></div>
            <div>Description: </div>
            <textarea type='text' value={description} onChange={(e) => setDescription(e.target.value)} style={{maxWidth:"90%"}}/>
            <div>
                <button onClick={addBlog}>Add</button>
                <span> </span>
                <button onClick={()=>{setDescription("");setTitle("");setShowTextFields(false);}}>Clear</button>
            </div>
            <hr />
            </>
        }
        {
            blogs.length ? 
            <>
                {
                    blogs.slice().reverse().map((blog) => <Blog key={blog._id} title={blog.title} description={blog.description} blogData={blog}/>)
                }
            </> : <span>No Blogs Available.</span>
        }
    </div>  
  );
};

export default Blogs;