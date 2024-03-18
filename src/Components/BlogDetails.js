import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const BlogDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [blogDetails, setBlogDetails] = useState({});
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updatingBlog, setUpdatingBlog] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token == null){
            navigate("/login");
        }
        else{
            fetchBlog();
        }
    },[navigate]);

    const fetchBlog = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_BASE_URL}/blogs/${location.state.blogDetails._id}`, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setBlogDetails(response.data);
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 2000);
    };

    const handleUpdateBlog = async () => {
        const token = localStorage.getItem("token");
        try {
            if(title.trim().length === 0){
                showError("Please enter a title.")
            } 
            else if(description.trim().length < 20){
                showError("Description must be atleast 20 characters long.");
            }
            else{
                const response = await axios.put(`${API_BASE_URL}/blogs/${blogDetails._id}`,{
                    title: title,
                    description: description
                },{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setBlogDetails(response.data);
                    setUpdatingBlog(false);
                    setTitle("");
                    setDescription("");
                }
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    };

    const handleDeleteBlog = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${API_BASE_URL}/blogs/${blogDetails._id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 204){
                setDeleted(true);
                setTimeout(() => {navigate("/blogs")}, 2000);
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    };

    const handleAddComment = async () => {
        const token = localStorage.getItem("token");
        try{
            if(newComment.trim().length === 0){
                showError("Please provide a comment.");
            }
            else{
                const response = await axios.post(`${API_BASE_URL}/blogs/${blogDetails._id}/comments`,{comment: newComment}, { 
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 201){
                    setBlogDetails(response.data.blog);
                    setNewComment("");
                    setAddingComment(false);
                }
            }
        }
        catch(error){
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    }

  return (
    <div style={{minHeight:"100vh"}}>
    {deleted ? 
        <h3>Blog deleted successfully. Navigating back to all blogs.</h3>
    : <div style={{padding:"10px", wordWrap:"break-word"}}>
        {error && <span style={{color: "red"}}>{error}</span>}

        {!updatingBlog && 
            <div style={{maxWidth: "90%", padding: "10px", border: "1px solid gray", borderRadius:"10px"}}>
                <h2>Title: {blogDetails?.title}</h2>
                <h4>Description: {blogDetails?.description}</h4>
                <div>
                    <button onClick={() => setUpdatingBlog(true)}>Update Blog</button>
                    <span> </span>
                    <button onClick={handleDeleteBlog}>Delete Blog</button>
                </div>
            </div>
        }

        {updatingBlog && 
        <div style={{maxWidth: "90%", padding: "10px", border: "1px solid gray", borderRadius:"10px"}}>
            <label>Title: </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            <div style={{marginTop:"10px"}}>Description: </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{width:"95%"}}/>
            <button onClick={handleUpdateBlog}>Update Blog</button>
            <span> </span>
            <button onClick={() => {setUpdatingBlog(false);setTitle("");setDescription("");}}>Cancel</button>
        </div>
        }

        <div style={{marginTop:"10px", maxWidth: "90%", padding: "10px", border: "1px solid gray", borderRadius:"10px"}}>

            {!addingComment && <button onClick={() => setAddingComment(true)} style={{marginBottom: "20px"}}>Add Comment</button>}

            {
                addingComment && 
                    <>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{width: "100%"}}/>
                        <div style={{marginBottom: "20px"}}>
                            <button onClick={handleAddComment}>Add</button>
                            <span> </span>
                            <button onClick={() => setAddingComment(false)}>Clear</button>
                        </div>
                    </>
            }

            {blogDetails?.comments?.length ? 
                <>
                {
                    blogDetails.comments.slice().reverse().map((comment) => (<Comment key={comment._id} comment={comment.comment} commentId={comment._id} blogId={blogDetails._id} />))
                }
                </> :
                <div style={{marginTop: "20px"}}>No Comments.</div>
            }
        </div>
    </div>}
    </div>
  );
};

export default BlogDetails;