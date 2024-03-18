import axios from 'axios';
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Comment = (props) => {
    const [updateComment, setUpdateComment] = useState(false);
    const [oldComment, setOldComment] = useState(props.comment);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");
    const [deleted, setDeleted] = useState(false);

    const showError = (message) => {
        setError(message);
        setTimeout(()=>{
            setError("");
        },2000);
    }
    
    const handleDeleteComment = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${API_BASE_URL}/blogs/${props.blogId}/comments/${props.commentId}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 204){
                setDeleted(true);
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    };

    const handleUpdateComment = async () => {
        const token = localStorage.getItem("token");
        try {
            if(newComment.trim().length === 0){
                showError("Comment cannot be empty.");
            }
            else{
                const response = await axios.put(`${API_BASE_URL}/blogs/${props.blogId}/comments/${props.commentId}`,{
                    comment: newComment
                },{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setOldComment(newComment);
                    setNewComment("");
                    setUpdateComment(false);
                }
            }
        } catch (error) {
            showError(error?.response?.data || "Network Error. Please try again!");
        }
    };

  return (
    <>
    {deleted ? <></> :
        <div style={{border: "1px solid gray", padding:"10px", boxSizing:"border-box", marginBottom:"10px"}}>
            {error && <div style={{color: 'red'}}>{error}</div>}
            {updateComment && <>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{width: "95%"}}/>
                <div>
                    <button onClick={handleUpdateComment}>Update Comment</button>
                    <span> </span>
                    <button onClick={() => setUpdateComment(false)}>Cancel</button>
                </div>
            </>}
            {!updateComment && <h2>Comment: {oldComment}</h2>}
            <div>
                {!updateComment && <button onClick={()=>setUpdateComment(true)}>Update</button>}
                <span> </span>
                {!updateComment && <button onClick={handleDeleteComment}>Delete</button>}
            </div>
        </div>
    }
    </>
  );
};

export default Comment;