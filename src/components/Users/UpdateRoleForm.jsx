// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Button, FormControl } from '@mui/material'
import axios from 'axios'
import Cookies from 'js-cookie'

const UpdateRoleForm = ( props ) => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const userId = props.userId
    const [open, setOpen] = useState(true)

    const handleCloseForm = () => {
        setOpen(!open)
        window.location.reload()
    }

    const [data, setData] = useState({
        role: ''
    })

    const handleChange = (e) => {
        const value = e.target.value
        setData({
            ...data,
            [e.target.name]: value
        })
    }

    const updateUserRole = () => {
        if (data.role != 'default') {
            const updateRole = async () => {
                await axios.patch(`http://127.0.0.1:8000/api/user/${userId}`, data, { headers }).then((response) => {
                    console.log(response.status)
                    if (response.status === 200) {
                        console.log(response.data.status)
                        window.location.reload()
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
            updateRole()
        }
    }

    return (
        <div>
        <Dialog open={open}>
            <DialogTitle>Ajouter nouvel utilisateur</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Select onChange={handleChange} name='role' defaultValue='default'>
                        <MenuItem value='default'>-- Rôle --</MenuItem>
                        <MenuItem value='manager'>Qualiticien</MenuItem>
                        <MenuItem value="user">Technologue</MenuItem>
                    </Select>   
                    <Button onClick={updateUserRole}>Confirmer</Button> 
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseForm}>Annuler</Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default UpdateRoleForm
