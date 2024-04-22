// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const UpdateServiceForm = ( idService ) => {
  
    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [service, setService] = useState([]);
    const [open, setOpen] = useState(true);

    const [data, setData] = useState({
        service: '',
        isUsed: true,
    });
    
    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value,
        });
        console.log(value)
    };

    const handleCheck = () => {
        setData({
            ...data,
            isUsed : !data.isUsed
        });        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serviceData = {
            name: data.service,
            isUsed: data.isUsed,
        };
        console.log(serviceData)
        await axios.patch(`http://127.0.0.1:8000/api/service/${idService.idService}`, serviceData, { headers }).then((response) => {
            if (response.status === 200) {
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleOpenModalForm = () => {
        setOpen(!open)
        window.location.reload();
    }
    
    useEffect(() => {
        const fecthData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/service/${idService.idService}`, { headers }).then((response) => {
                setService(response.data.data.data)
                setData({
                    service: response.data.data.data.name,
                    isUsed : response.data.data.data.isUsed,
                })
            }).catch((error) => {
                console.log(error);
            })
        }
        fecthData();
    }, [])

    return (
        <div className='container'>
            <div className="form">
                <Dialog open={open}>
                    <DialogTitle>Modifier service</DialogTitle>
                    <DialogContent className='modalForm'>
                        <input type="text" name='service' value={data.service || service.name || ''} onChange={handleChange}/>                      
                        <div>
                            <FormControlLabel control={ <Checkbox name='isUsed' onChange={handleCheck} checked={data.isUsed}/> } label="isUsed" />
                        </div> 
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

export default UpdateServiceForm
