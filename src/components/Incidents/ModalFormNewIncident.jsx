// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, MenuItem, TextField} from '@mui/material'
import axios from 'axios'
import Cookies from 'js-cookie'

const ModalFormNewIncident = ( props ) => {
    
    // eslint-disable-next-line react/prop-types
    const id = props.idEquipment
    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [data, setData] = useState({
        title: '',
        description: '',
        impact: '',
    })

    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(!open)
        window.location.reload()
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
    }

    const handleSubmit = async () => {
        const incidentData = {
            title: data.title,
            description: data.description,
            impact: data.impact,
        }
        await axios.post(`http://127.0.0.1:8000/api/equipment/${id}/incident/newIncident`, incidentData, { headers }).then((response) => {
            console.log(response)
            if (response.status === 201) {
                window.location.reload()   
            } 
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Nouvel incident</DialogTitle>
                <DialogContent className='modalForm'>
                    <FormControl fullWidth>
                        <Select onChange={handleChange} name='impact' defaultValue='default'>
                            <MenuItem value='default'>-- Impact --</MenuItem>
                            <MenuItem value='Bas'>Bas</MenuItem>
                            <MenuItem value="Moyen">Moyen</MenuItem>
                            <MenuItem value='Haut'>Haut</MenuItem>
                            <MenuItem value='Urgent'>Urgent</MenuItem>
                        </Select>  
                        <TextField type='text' name='title' value={data.title} placeholder='Titre' onChange={handleChange} />
                        <TextField type="text" name='description' value={data.description} placeholder='Description' onChange={handleChange} multiline rows={6}/>                   
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

export default ModalFormNewIncident
