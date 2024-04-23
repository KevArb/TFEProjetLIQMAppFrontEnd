// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const CommentStepModalForm = ( ids ) => {

    console.log(ids)
    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    };

    const [open, setOpen] = useState(true);
    const [id, setId] = useState(ids.stepId);
    const [idMaintenance, setIdMaintenance] = useState(ids.maintenanceId);
    const [step, setStep] = useState([]);
    const [errMsg, setErrMsg] = useState({
        commentErr: null,
        reasonErr: null,
    });
    const [data, setData] = useState({
        comment: '',
        reasonComment: '',
        step: id,
    });
    
    const handleOpenModalForm = () => {
        setOpen(!open)
        window.location.reload();
    }

    const handleChangeSelectStatus = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
    }

    const handleComment = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
        console.log(value)
    }

    const postComment = async () => {
        const commentData = {
            comment: data.comment,
            reasonComment: data.reasonComment,
            step: id,
            maintenanceSheet: idMaintenance,
        }
        return await axios.post(`http://127.0.0.1:8000/api/maintenanceSheet/steps/comment/`, commentData, { headers }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error)
        })
    }

    const updateStatusStep = async (status) => {
        const data = {
            status: status
        }
        return await axios.patch(`http://127.0.0.1:8000/api/maintenanceSheet/steps/${id}`, data, { headers }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSubmit = async () => {
        
        if (data.comment === '' || data.reasonComment === '' || data.reasonComment === 'default') {
            if (data.comment === '') setErrMsg({ commentErr: 'Veuillez renseigner un commentaire'})
            if (data.reasonComment === '' || data.reasonComment === 'default') setErrMsg({ reasonErr: 'Veuillez renseigner un statut'}) 
        } else {
            if (data.reasonComment === 'Général') {
                postComment();
                window.location.reload();
            } else if (data.reasonComment === 'En erreur') {
                postComment();
                updateStatusStep('En erreur');
                window.location.reload();
            } else if (data.reasonComment === 'En attente') {
                postComment();
                updateStatusStep('En attente');
                window.location.reload();
            } else if (data.reasonComment === 'Réouvrir') {
                postComment();
                updateStatusStep('En cours');
                window.location.reload();
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet/steps/step/${id}`, { headers }).then((response) => {
                setStep(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]    
                        setStep(value)         
                    }
                }  
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData(); 
    }, [])

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Commenter étape</DialogTitle>
                    <DialogContent className='modalForm'>
                        <InputLabel>Status</InputLabel>
                        <Select name='reasonComment' onChange={handleChangeSelectStatus} defaultValue='default'>
                            <MenuItem value='default'>-- Statut --</MenuItem>
                            <MenuItem value='En attente'>En attente</MenuItem>
                            <MenuItem value='En erreur'>En erreur</MenuItem>
                            <MenuItem value='Général'>Général</MenuItem>
                            <MenuItem value='Réouvrir'>Réouvrir</MenuItem>
                        </Select>
                        {errMsg.reasonErr ? <div className='error-msg'>{errMsg.reasonErr }</div> : <div></div>}
                        <TextField className='textfiled-modal-comment' type="text" name='comment' placeholder='Commentaire' value={data.comment} onChange={handleComment} multiline/>
                        {errMsg.commentErr ? <div className='error-msg'>{errMsg.commentErr}</div> : <div></div>}
                        <Button onClick={handleSubmit}>Confirmer</Button>  
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleOpenModalForm} >Annuler</Button>
                    </DialogActions>
            </Dialog>
        </div>
    )
}

export default CommentStepModalForm
