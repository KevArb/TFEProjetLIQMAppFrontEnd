// eslint-disable-next-line no-unused-vars
import React, { useState }  from 'react'
import axios from 'axios';
import { formatErrMsg } from '../../utils/functions/Library';
import Cookies from 'js-cookie';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const NewSupplierForm = () => {

    const token = Cookies.get('token');
    const [open, setOpen] = useState(true);
    const [data, setData] = useState({
        compagny: '',
        hotlineMail: '',
        phone: '',
        hotlinePhoneNumber2: '',
    });

    const handleOpenModalForm = () => {
        setOpen(!open)
        window.location.reload();
    }

    const [errMsg, setErrMsg] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supplierData = {
            nameCompagny: data.compagny,
            hotlineMail: data.hotlineMail,
            hotlinePhoneNumber: data.phone,
            hotlinePhoneNumber2: data.hotlinePhoneNumber2,

        };
        try {
            await axios.post('http://127.0.0.1:8000/api/supplier/newSupplier', supplierData, {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                console.log(response)
                if (response.status === 201) {
                    setData({
                        compagny: '',
                        hotlineMail: '',
                        phone: '',
                        hotlinePhoneNumber2: '',
                    })
                    window.location.reload();
                }
            });            
        } catch (error) {
            setErrMsg(formatErrMsg(error.response.data.message))
        }

    };

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Rajouter un nouveau fournisseur</DialogTitle>
                <DialogContent className='modalForm'>
                <div>
                    <input type="text" name='compagny' value={data.compagny} placeholder='COmpagnie' onChange={handleChange}/>
                </div>   
                <div>
                    <input type="text" name='hotlineMail' value={data.hotlineMail} placeholder='Email' onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" name='phone' value={data.phone} placeholder='Téléphone' onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" name='hotlinePhoneNumber2' value={data.hotlinePhoneNumber2} placeholder='Téléphone 2'onChange={handleChange}/>  
                </div>
                {errMsg.map((e) => {
                    return(<div key={e}>
                        {e}
                    </div>)                   
                    })}
                <Button onClick={handleSubmit}>Confirmer</Button> 
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOpenModalForm}>Close</Button>
                </DialogActions>
            </Dialog>

        </div>
   
    )
}

export default NewSupplierForm
