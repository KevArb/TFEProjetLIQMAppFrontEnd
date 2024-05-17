// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, Button, TextField, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';

const IncidentCloseComment = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const {id} = useParams();
    const [open, setOpen] = useState(true)
    const [data, setData] = useState({
        comment: '',
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value 
        });
    };

    const resolveIncident = async () => {
        const status = {
            status: 'Clôturé',
            isClosed: true,
        }
        await axios.patch(`http://127.0.0.1:8000/api/incident/${id}`, status, { headers }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                handleCLoseIncident();
                window.location.reload(); 
            } 
        }).catch((error) => {
            console.log(error)
        })
    }

    const closeModalForm = () => {
        window.location.reload()
    }

    const handleCLoseIncident = async () => {
        const status = {
            status: 'Clôturé',
            isClosed: true,
        }
        await axios.patch(`http://127.0.0.1:8000/api/incident/${id}`, status, { headers }).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }

    const postComment = async (e) => {
        e.preventDefault();
        const comment = {
            comment: data.comment,
            status: 'Clôturé',
        };
        await axios.post(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, comment, { headers }).then((response) => {
            if (response.status === 200) {
                resolveIncident()
                window.location.reload()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div className='modal-form-comment' >
                <Dialog open={open}>
                    <DialogTitle>Clôture</DialogTitle>
                    <DialogContent>
                    <TextField type="text" name='comment' value={data.comment} placeholder='Commentaire' onChange={handleChange} multiline rows={6}/> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={postComment}>Confirmer</Button>
                        <Button onClick={closeModalForm}>Annuler</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default IncidentCloseComment
