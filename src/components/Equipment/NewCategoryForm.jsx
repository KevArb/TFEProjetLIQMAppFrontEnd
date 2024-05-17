// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';

const NewCategoryForm = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [open, setOpen] = useState(true);
    const [data, setData] = useState({
        name: '',
      });

    const handleOpenModalForm = () => {
        setOpen(!open)
        window.location.reload();
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
        console.log(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const categoryData = {
            name: data.name,
        };
        try {
            await axios.post('http://127.0.0.1:8000/api/equipmentCat/newEquipmentCat', categoryData, { headers }).then((response) => {
                if (response.status === 201) {
                    setData({
                        name: '',
                    })
                    window.location.reload();
                }
            });            
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Rajouter une nouvelle catégorie</DialogTitle>
                <DialogContent className='modalForm'>
                    <input type="text" name='name' value={data.name} placeholder='Catégorie' onChange={handleChange}/>
                    <Button onClick={handleSubmit}>Confirmer</Button> 
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOpenModalForm}>Close</Button>
                </DialogActions>
            </Dialog>
            <button onClick={handleSubmit}>Submit</button>   
        </div>
   
    )
}

export default NewCategoryForm
