// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import IncidentComment from './IncidentComment';
import Sidebar from '../Sidebar/Sidebar';
import IncidentCloseComment from './IncidentCloseComment';
import './css/IncidentView.css';
import { Button } from '@mui/material';

const IncidentView = () => {

    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const {id} = useParams();
    // const navigateTo = useNavigate();
    
    const [incident, setIncident] = useState({});
    const [role, setRole] = useState([]);
    const [commentForm, setCommentForm] = useState(false);
    const [commentCloseForm, setCommentCloseForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [data, setData] = useState({
        comment: '',
    });

    const handleCommentForm = () => {
        setCommentForm(!commentForm);
    }
    

    const handleCommentCloseForm = () => {
        setCommentCloseForm(!commentCloseForm);
    }

    const handleOpenIncident = async () => {
        const status = {
            status: 'En cours'
        }
        await axios.patch(`http://127.0.0.1:8000/api/incident/${id}`, status, { headers }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                window.location.reload();   
            } 
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value 
        });
        console.log(value)
    };

    const postComment = async (e) => {
        e.preventDefault();
        const comment = {
            comment: data.comment,
        };
        console.log(data)
        await axios.post(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, comment, { headers }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                window.location.reload(); 
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident/${id}`, { headers }).then((response) => {
                setIncident(response.data);
                setRole(response.data.role);
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setIncident(value)         
                    }
                }  
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, { headers }).then((response) => {
                setComments(response.data);
                console.log(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data.data) {
                        const value = response.data.data[key]
                        setComments(value)        
                    }
                }  
                console.log(comments);
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData();
    }, [])

    return (
        <div className='container-incident'>
            <Sidebar userRole={role} />
            <div className="incidents-details">
                <div className='incident-grid'>
                    <div className='title-incident'>
                        <h1>{incident.title}</h1>
                        <p>{incident.code}</p>
                    </div>
                    <div className='description-incident'>
                        <p>{incident.description}</p>
                    </div>
                    <div className='status-incident'>
                        <p>{incident.status}</p>
                        <p>{incident.impact}</p>
                        <p>{incident.dateTimeOfIncident}</p>
                    </div>
                    <div className='form-comment-incident'>
                        <div className="form-view">
                            <form>
                                <input id='comment-field' type="text" name='comment' value={data.comment} placeholder='Commentaire' onChange={handleChange}/>
                                <Button onClick={postComment}>Commenter</Button>
                            </form> 
                        </div>
                    </div> 
                    <div className="btn-actions">
                    {incident.status === 'Résolu' ?
                        <div></div> : <Button onClick={handleCommentForm}>Résolu</Button> }
                        {role === 'admin' ? <Button onClick={handleOpenIncident}>Réouvrir</Button> : <div></div>}
                        {commentForm ? <IncidentComment role={role}/> : null }
                        {role === 'admin' ? <Button onClick={handleCommentCloseForm}>Clôturer</Button> : <div></div>}
                        {commentCloseForm ? <IncidentCloseComment role={role}/> : null }
                    </div> 
                    <div className="comments-incident">
                        <div className="comments-view">
                            {/* <div className="title-comment-view">
                                <h1>Commentaires</h1>
                            </div> */}
                                {comments.map((comment) => {
                                    return(
                                        <div className='comment-by-user' key={comment.id}>
                                            <div className="comment-flex">
                                                <div className='comment'>
                                                    <p>{comment.comment}</p>
                                                </div>
                                                <div className='commentedBy'>
                                                    <p>{comment.commentedBy.login}</p>
                                                </div>
                                                <div className='creattedAt'> 
                                                    <p>{comment.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>               
            </div>
        </div>
    )
}

export default IncidentView
