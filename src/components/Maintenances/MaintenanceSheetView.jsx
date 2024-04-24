/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import Sidebar from '../Sidebar/Sidebar'
import './css/MaintenanceSheetView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircleCheck, faFilePen, faComment } from '@fortawesome/free-solid-svg-icons'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CommentStepModalForm from './CommentStepModalForm'
import { formatDateTime } from '../../utils/functions/Library'

const MaintenanceSheetView = () => {

    const {id} = useParams()
    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [fms, setFms] = useState({})
    const [role, setRole] = useState([])
    const [steps, setSteps] = useState([])
    const [needCommentStep, setNeedCommentStep] = useState(false)
    const [stepIdForComment, setStepIdForComment] = useState('')
    const [maintenanceIdForComment, setMaintenanceIdForComment] = useState('')
    const [comments, setComments] = useState([])
    const [openFormCloseMS, setOpenFormCloseMS] = useState(false)

    const computeFinalStatus = ( array ) => {
        let value = ''
        let done = 0
        let ongoing = 0
        let inerror = 0
        let inwaiting = 0
        let total = 0
        array.map((el) => {
            if (el.status === 'Fait') {
                done += 1
                total += 1
            } else if (el.status === 'En cours') {
                ongoing += 1
                total += 1
            } else if (el.status === 'En erreur') {
                inerror += 1
                total += 1
            } else if (el.status === 'En attente') {
                inwaiting += 1
                total += 1
            }
        });
        if (inerror >= 1) {
            value = 'En erreur'
        } else if (inwaiting >= 1) {
            value =  'En attente'
        } else if (ongoing >= 1) {
            value =  'En cours'
        } else if (done == total & done != 0 ) {
            value =  'Fait'
        }
        return value;
    }

    // fetch maintenanceSheet data
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, { headers }).then((response) => {
                setFms(response.data)
                setRole(response.data.role)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setFms(value)         
                    }
                }  
            }).catch((error) => {
                // console.log(error)
            })
        }
        fetchData();
    }, [])

    // fetch steps from maintenanceSheet
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/steps/${id}`, { headers }).then((response) => {
                setSteps(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]    
                        setSteps(value)         
                    }
                }  
            }).catch((error) => {
                // console.log(error)
            })
        }
        fetchData(); 
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/steps/comments/${id}`, { headers }).then((response) => {                
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]    
                        setComments(value)         
                    }
                }  
            }).catch((error) => {
                // console.log(error)
            })
        }
        fetchData()
    }, [])

    const handleConfirmMaintenanceSheet = async () => {
        let isValidate = false
        const finalMaintenaceStatus = computeFinalStatus(steps)
        if (finalMaintenaceStatus === 'Fait') {
            isValidate = true
        } 
        const data = {
            finalStatus : finalMaintenaceStatus,
            isValidate : isValidate,
        }
        await axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, data, { headers }).then(() => {
            window.location.reload()
        }).catch((error) => {
            // console.log(error)
        })
    }

    //Discontiné
    //if finalStatus is "Discontinué" => change steps of this MS to "Discontinué also or erreur" and block MS
    const closeMS = () => {
        setOpenFormCloseMS(!openFormCloseMS)
    }

    const handleCloseMS = async () => {
        const finalMaintenaceStatus = computeFinalStatus(steps)
        if (finalMaintenaceStatus === 'En erreur') {
            const data = {
                finalStatus : 'Discontinué',
            }
            await axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, data, { headers }).then(() => {
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    window.addEventListener('popstate', function() {
        let isValidate = false
        const finalMaintenaceStatus = computeFinalStatus(steps);
        if (finalMaintenaceStatus === 'Fait') {
            isValidate = true
        } 
        const data = {
            finalStatus : finalMaintenaceStatus,
            isValidate : isValidate,
        }
        axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, data, { headers }).then(() => {
            window.location.reload()
        }).catch((error) => {
            // console.log(error)
        })
    });

    // function which update the status step, this fu nction is call when an user done the step
    const commmentModalFormSteps = ( stepId, maintenanceId ) => {
        setStepIdForComment(stepId)
        setMaintenanceIdForComment(maintenanceId)
        setNeedCommentStep(!needCommentStep)
    }

    const handleClickSteps = async ( stepId, status ) => {
        const data = {
            status : status
        }
        await axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/steps/${stepId}`, data, { headers }).then(() => {
            window.location.reload();
        }).catch((error) => {
            // console.log(error)
        })
    };

    return (
        <div className='container-sheet-view'>
            <Sidebar userRole={role} />
            <div className="steps-maintenance">
                <div className='flex-step-maintenance'>
                    <div className="title-maintenance">
                        <h1>Feuille de maintenance :</h1>
                        <h1>{fms.name}</h1>
                    </div>
                    <div className="status-maintenance">
                        <h2>{fms.finalStatus}</h2>
                    </div>
                    {steps?.map((step) => {
                        return(
                            <div className='step-maintenance' key={step._id}>
                                <p>Etape : </p>
                                <div className="step-number">
                                    <p>{step.number}</p>
                                </div>
                                <div className="step-title">
                                    <div>{step.title}</div>
                                </div>
                                <div className="current-step-status">
                                    <p>{step.status}</p>
                                </div>
                    
                                <div className="doneBtn">
                                    {
                                    step.status === 'En cours' ? 
                                        <div className='action-btn-step' onClick={() => handleClickSteps( step._id, 'Fait' )} type='button'><FontAwesomeIcon icon={faCheck} /></div> : 
                                        <div className='action-btn-step' type='button'><FontAwesomeIcon icon={faCircleCheck} /></div>
                                    }
                                    <div onClick={() => handleClickSteps( step._id, 'En cours' )} className='action-btn-step'><FontAwesomeIcon icon={faFilePen} /></div>
                                    <div onClick={() => commmentModalFormSteps( step._id, step.maintenanceSheet )} className='action-btn-step'><FontAwesomeIcon icon={faComment} /></div>
                                </div>
                                {needCommentStep ? <div>
                                    <div className="comment-step">
                                        <CommentStepModalForm stepId={stepIdForComment} maintenanceId={maintenanceIdForComment}/>
                                    </div>
                                </div> : null }
                                <div className="details-step">
                                    {/* <p>{step.description}</p> */}
                                </div>
                            </div>   
                        )  
                    })}
                    <div className="confirm-maintenance-sheet">
                        { fms.finalStatus === 'Discontinué' || fms.finalStatus === 'Fait' ? 
                        <div></div> : <div><Button onClick={handleConfirmMaintenanceSheet}>Valider</Button></div>
                        }
                        {
                            role === 'admin' ? 
                            <div>
                                {fms.finalStatus === 'En erreur' ? <div onClick={handleCloseMS}><Button>Discontinuer</Button></div> : <div></div>}     
                            </div> :
                            <div></div>
                        }
                        {/* <Dialog closeMS={openFormCloseMS}>
                            <DialogTitle></DialogTitle>
                            <DialogContent>
                                
                            </DialogContent>
                            <DialogActions></DialogActions>
                        </Dialog> */}
                    </div>
                    {comments ? <div><h1>Commentaires</h1></div> : <div></div>}
                    <div className='comment-section'>
                        <div className='comment-card'> 
                        <TableContainer className='comment-div' >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Utilisateur
                                        </TableCell>
                                        <TableCell>
                                            Raison
                                        </TableCell>
                                        <TableCell>
                                            Etape n°
                                        </TableCell>
                                        <TableCell>
                                            Commentaire
                                        </TableCell>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {comments?.map((comment) => {
                                        return (
                                            <TableRow key={comment._id}>
                                                <TableCell className="comment-user">
                                                    <p>{comment.commentedBy.login}</p>
                                                </TableCell>
                                                <TableCell className="comment-reason">
                                                    <p>mise en : {comment.reasonComment}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{comment.step.number} </p>
                                                </TableCell>
                                                <TableCell className="comment-text" style={{ whiteSpace: 'normal', wordBreak: 'break-word'}}>
                                                    <p>{comment.comment}</p>
                                                </TableCell>
                                                <TableCell className="comment-date">
                                                    <p>{formatDateTime(comment.commentedAt)}</p>
                                                </TableCell>
                                            </TableRow>   
                                        )
                                    })}
                                </TableBody>
                            </Table> 
                        </TableContainer> 
                        </div>
                    </div>   
                </div>
            </div> 
      
        </div>
    )
}

export default MaintenanceSheetView
