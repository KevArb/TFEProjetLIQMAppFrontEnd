// eslint-disable-next-line no-unused-vars
import React, { useState }  from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import './css/NewServiceForm.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const NewServiceForm = () => {
    const token = Cookies.get('token');
    const [open, setOpen] = useState(true);

    const [data, setData] = useState({
        service: '',
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
        const serviceData = {
            name: data.service,
        };
        try {
            await axios.post('http://127.0.0.1:8000/api/service/newService', serviceData, {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                console.log(response)
                if (response.status === 201) {
                    setData({
                        service: '',
                    })
                    window.location.reload();
                }
            });            
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div className='container'>
            <div className="form">
                <Dialog open={open}>
                    <DialogTitle>Rajouter un nouveau service</DialogTitle>
                    <DialogContent className='modalForm'>
                        <input type="text" name='service' value={data.service} placeholder='Add Service' onChange={handleChange}/>
                        <Button onClick={handleSubmit}>Confirmer</Button> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleOpenModalForm}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default NewServiceForm
