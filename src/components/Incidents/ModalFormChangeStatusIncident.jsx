// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, MenuItem, TextField} from '@mui/material';
import axios from 'axios'
import Cookies from 'js-cookie'


const ModalFormChangeStatusIncident = ( idIncident ) => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [open, setOpen] = useState(true)
    const [data, setData] = useState({
        comment: '',
        status: '',
    })

    const handleSelect = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
        console.log(value)
    }

    const handleComment = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
        console.log(value)
    }

    const handleClose = () => {
        setOpen(!open)
        window.location.reload()
    }

    const addComment = async () => {
        const dataForm = {
            comment: data.comment,
            commentType: data.status,
        }
        console.log(dataForm)
        await axios.post(`http://127.0.0.1:8000/api/incident/${idIncident.idIncident}/commentIncident`, dataForm, { headers }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const updateIncident = async () => {
        const dataForm = {
            status: data.status,
            updatedAt: Date.now(),
        }

        await axios.patch(`http://127.0.0.1:8000/api/incident/${idIncident.idIncident}`, dataForm, { headers }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error.data)
        })
    }

    const handleSubmit = () => {
        addComment()
        updateIncident()
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Commenter status</DialogTitle>
                <DialogContent className='modalForm'>
                    <FormControl fullWidth>
                        <Select name='status' onChange={handleSelect} defaultValue='default'>
                            <MenuItem value='default'>-- Statut --</MenuItem>
                            <MenuItem value='En cours'>En cours</MenuItem>
                            <MenuItem value="En attente d'une action">En attente action</MenuItem>
                            <MenuItem value='Clarification'>Clarification</MenuItem>
                            <MenuItem value='Résolu'>Résolu</MenuItem>
                        </Select>   
                        <TextField type="text" name='comment' value={data.comment} placeholder='Commentaire' onChange={handleComment} multiline rows={6}/>                   
                        <Button onClick={handleSubmit}>Confirmer</Button> 
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalFormChangeStatusIncident
