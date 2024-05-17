/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../Sidebar/Sidebar'
import './css/MaintenanceSheetView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircleCheck, faFilePen, faComment, faCircleInfo, faHourglassStart, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Button, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, Alert, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'
import CommentStepModalForm from './CommentStepModalForm'
import { formatDateTime } from '../../utils/functions/Library'
import Cookies from 'js-cookie'

const MaintenanceSheetView = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const {id} = useParams()
    const [fms, setFms] = useState({})
    const [role, setRole] = useState([])
    const [steps, setSteps] = useState([])
    const [needCommentStep, setNeedCommentStep] = useState(false)
    const [stepIdForComment, setStepIdForComment] = useState('')
    const [maintenanceIdForComment, setMaintenanceIdForComment] = useState('')
    const [comments, setComments] = useState([])
    const [openFormCloseMS, setOpenFormCloseMS] = useState(false)
    const [modalDisc, setModalDisc] = useState(false)
    const [discComment, setDiscComment] = useState({
        comment: ''
    })
    const [errDiscMsg, setErrDiscMsg] = useState('')

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
        })
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
            console.log(error)
        })
    }

    useEffect(() => {
        const fetchFM = async () => {
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
                console.log(error)
            })
        }
        const fecthSteps = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/steps/${id}`, { headers }).then((response) => {
                setSteps(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]    
                        setSteps(value)        
                    }
                } 
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchComment = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/steps/comments/${id}`, { headers }).then((response) => {                
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]    
                        setComments(value)         
                    }
                }  
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchFM()
        fecthSteps()
        fetchComment()
    }, [id])

    //Discontiné
    //if finalStatus is "Discontinué" => change steps of this MS to "Discontinué also or erreur" and block MS
    const closeMS = () => {
        setOpenFormCloseMS(!openFormCloseMS)
    }

    const handleDiscComment = (e) => {
        const value = e.target.value
        setDiscComment({
            ...discComment,
            [e.target.name]: value
        }) 
    }

    const handleCloseMS = async () => {
        const finalMaintenaceStatus = computeFinalStatus(steps)
        if (discComment.comment === '' || discComment.comment === null) {
             setErrDiscMsg('Veuillez donner un raison')   
        } else if (finalMaintenaceStatus === 'En erreur') {
            const data = {
                finalStatus : 'Discontinué',
                finalComment: discComment.comment,
                isValidate: true,
            }
            await axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, data, { headers }).then(() => {
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    // window.addEventListener('popstate', function() {
    //     let isValidate = false
    //     const finalMaintenaceStatus = computeFinalStatus(steps);
    //     if (finalMaintenaceStatus === 'Fait') {
    //         isValidate = true
    //     } 
    //     const data = {
    //         finalStatus : finalMaintenaceStatus,
    //         isValidate : isValidate,
    //     }
    //     axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/${id}`, data, { headers }).then(() => {
    //         window.location.reload()
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // })

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
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleDiscModal = () => {
        setModalDisc(!modalDisc)
    }

    const closeDiscModal = () => {
        window.location.reload()
    }

    const iconDisplay = (status, id) => {
        if (status === 'En cours') {
            return <div className='action-btn-step' onClick={() => handleClickSteps(id, 'Fait')} type='button'><FontAwesomeIcon icon={faCheck} /></div>
        } else if (status === 'En erreur') {
            return <div type='button'><FontAwesomeIcon icon={faTriangleExclamation} /></div>
        } else if (status === 'En attente') {
            return <div type='button'><FontAwesomeIcon icon={faHourglassStart} /></div>
        } else if (status === 'Fait') {
            return <div type='button'><FontAwesomeIcon icon={faCircleCheck} /></div>
        }
    }

    const msgFinalStatusFM = (finalStatus) => {
        if (finalStatus === 'Discontinué') {
            return <div> <Alert severity="error"> Fm discontinué car : {fms.finalComment} </Alert> </div> 
        } else if (finalStatus === 'Fait') {
            return  <div> <Alert severity="success"> Fm terminée </Alert> </div> 
        } else {
            return <h2>{finalStatus}</h2>
        }
    }

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
                        {msgFinalStatusFM(fms.finalStatus)}
                    </div>
                    {steps.sort((a, b) => a.number - b.number)?.map((step) => {
                        return(
                            <div className='step-maintenance' key={step._id}>
                                { fms.finalStatus === 'Discontinué' || fms.finalStatus === 'Fait' ? null : 
                                    <div className='step-maintenance'>
                                        <Tooltip disableFocusListener title={step.description}>
                                            <FontAwesomeIcon icon={faCircleInfo} />
                                        </Tooltip>
                                        <div className="doneBtn">
                                        { iconDisplay(step.status,  step._id) }
                                            <div onClick={() => handleClickSteps( step._id, 'En cours' )} className='action-btn-step'><FontAwesomeIcon icon={faFilePen} /></div>
                                            <div onClick={() => commmentModalFormSteps( step._id, step.maintenanceSheet )} className='action-btn-step'><FontAwesomeIcon icon={faComment} /></div>
                                        </div>
                                        { needCommentStep ? <div>
                                            <div className="comment-step">
                                                <CommentStepModalForm stepId={stepIdForComment} maintenanceId={maintenanceIdForComment}/>
                                            </div>
                                            </div> : null }
                                        <div className="current-step-status">
                                            <p>{step.status}</p>
                                        </div>
                                        <p>Etape : </p>
                                        <div className="step-number">
                                            <p>{step.number}</p>
                                        </div>     
                                        <div className="step-title">
                                            <div>{step.title}</div>
                                        </div>
                                    </div>}
                            </div>   
                        )  
                    })}
                    <div className="confirm-maintenance-sheet">
                        { fms.finalStatus === 'Discontinué' || fms.finalStatus === 'Fait' ?
                        null : <div><Button onClick={handleConfirmMaintenanceSheet}>Valider</Button></div>}
                        { role === 'admin' ? 
                            <div>
                                {fms.finalStatus === 'En erreur' ? <div onClick={handleDiscModal}><Button>Discontinuer</Button></div> : <div></div>}    
                            </div> : null }
                        { modalDisc ? <div>
                            <Dialog open={modalDisc}>
                                <DialogContent>
                                    <p>Raison :</p>
                                    <TextField className='textfiled-modal-comment' type="text" name='comment' 
                                        placeholder='Commentaire' value={discComment.comment} 
                                        onChange={handleDiscComment} multiline />
                                    {errDiscMsg ? <div><span className='error-msg '>{errDiscMsg}</span></div> : null}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseMS}>Confirmer</Button>
                                    <Button onClick={closeDiscModal}>Annuler</Button>
                                </DialogActions>
                            </Dialog>
                        </div> : null }
                    </div>
                    {comments ? <div><h1>Commentaires</h1></div> : null }
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
                                    {comments.sort((a, b) => new Date(b.commentedAt) - new Date(a.commentedAt))?.map((comment) => {
                                        return (
                                            <TableRow key={comment._id}>
                                                <TableCell className="comment-user">
                                                    <p>{comment.commentedBy.login}</p>
                                                </TableCell>
                                                <TableCell className="comment-reason">
                                                    <p>{comment.reasonComment}</p>
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
