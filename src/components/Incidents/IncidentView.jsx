// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import IncidentComment from './IncidentComment'
import Sidebar from '../Sidebar/Sidebar'
import IncidentCloseComment from './IncidentCloseComment'
import './css/IncidentView.css'
import { Button, TableContainer, TextField, TableHead, Table, TableRow, TableCell, TableBody } from '@mui/material'
import { formatDateTime } from '../../utils/functions/Library'
import ModalFormChangeStatusIncident from './ModalFormChangeStatusIncident'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { headers } from '../../utils/functions/constLibrary'

const IncidentView = () => {

    const {id} = useParams()    
    const [incident, setIncident] = useState({})
    const [role, setRole] = useState([])
    const [commentForm, setCommentForm] = useState(false)
    const [commentCloseForm, setCommentCloseForm] = useState(false)
    const [comments, setComments] = useState([])
    const [formUpdateStatus, setFormUpdateStatus] = useState(false)
    const [user, setUser] = useState()
    const [errComment, setErrComment] = useState()
    const [data, setData] = useState({
        comment: '',
    })

    const handleCommentForm = () => {
        setCommentForm(!commentForm)
    }
    
    const handleCommentCloseForm = () => {
        setCommentCloseForm(!commentCloseForm)
    }

    const handleUpdateForm = () => {
        setFormUpdateStatus(!formUpdateStatus)
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
        e.preventDefault()
        const comment = {
            comment: data.comment,
        }
        if (comment.comment === null || comment.comment === '') { 
            setErrComment('Veuillez renseigner un commentaire') 
        } else {
            await axios.post(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, comment, { headers }).then((response) => {
                if (response.status === 200) {
                    window.location.reload()
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        const fetchIncidentData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident/${id}`, { headers }).then((response) => {
                setIncident(response.data)
                setRole(response.data.role)
                setUser(response.data.login)
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

        const fetchCommentData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, { headers }).then((response) => {
                setComments(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data.data) {
                        const value = response.data.data[key]
                        setComments(value)        
                    }
                }  
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchIncidentData();
        fetchCommentData()
    }, [id])

    return (
        <div className='container-incident'>
            <Sidebar userRole={role} user={user} />
            <div className="incidents-details">
                <div className='incident-grid'>
                    <div className='title-incident'>
                        <h1>{incident.title}</h1>
                        <p>Incident N° : {incident.code}</p>
                    </div>
                    <div className='description-incident'>
                        <p>{incident.description}</p>
                    </div>
                    <div className='status-incident'>
                        <div>{incident.status}</div>
                        <div>{incident.impact}</div>
                        <div>{formatDateTime(incident.dateTimeOfIncident)}</div>
                    </div>
                    <div className='form-comment-incident'>
                        <div className="form-view">
                            <form>
                                <TextField id='comment-field' type="text" name='comment' value={data.comment} placeholder='Commentaire' onChange={handleChange} multiline rows={6}/>
                                {errComment ? <span className='err-msg'>{errComment}</span> : null}
                                <Button onClick={postComment}>Commenter</Button>
                            </form>                            
                        </div>
                    </div> 
                    <div className="btn-actions">
                    <Button onClick={handleUpdateForm}>Modifier Statut</Button>
                    {incident.status === 'Résolu' || incident.status === "Clôturé" ?
                        <div></div> : null }      
                        {commentForm ? <IncidentComment role={role}/> : null }
                        {role === 'admin' && incident.status != "Clôturé" ? <Button onClick={handleCommentCloseForm}>Clôturer</Button> : <div></div>}
                        {commentCloseForm ? <IncidentCloseComment role={role}/> : null }

                    </div> 
                    <div className="comments-incident">
                        <div className="comments-view">
                            <h2>Historique</h2>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Statut
                                            </TableCell>
                                            <TableCell align="center">
                                                Utilisateur
                                            </TableCell>
                                            <TableCell>
                                                Commentaire
                                            </TableCell>
                                            <TableCell align="center">
                                                Le
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((comment) => {
                                            return(
                                                <TableRow key={comment.id}>
                                                    <TableCell>
                                                        {comment.commentType}  
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <p>{comment.commentedBy.login}</p>
                                                    </TableCell>
                                                    <TableCell >
                                                        <div className='comment-cell'>
                                                            {comment.comment}
                                                        </div>                                                       
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <p>{formatDateTime(comment.createdAt)}</p>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    {formUpdateStatus ? <div><ModalFormChangeStatusIncident idIncident={id}/></div> : <div></div>}
                </div>               
            </div>
        </div>
    )
}

export default IncidentView
