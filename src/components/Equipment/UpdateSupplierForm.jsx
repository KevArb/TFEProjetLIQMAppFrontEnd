// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import './css/UpdateEquipment.css';
import { formatErrMsg } from '../../utils/functions/Library';

const UpdateSupplierForm = ( idSupplier ) => {

    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [supplier, setSupplier] = useState([]);
    const [open, setOpen] = useState(true);
    const [errMail, setErrMail] = useState('');

    const [data, setData] = useState({
        nameCompagny: '',
        isUsed: true,
        hotlinePhoneNumber: '',
        hotlinePhoneNumber2: '',
        hotlineMail: '',
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value === '' ? null : value 
        });
    };

    const handleCheck = () => {
        setData({
            ...data,
            isUsed : !data.isUsed
        });        
    };

    const handleOpenModalForm = () => {
        setOpen(!open)
        window.location.reload();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supplierData = {
            nameCompagny: data.nameCompagny,
            isUsed: data.isUsed,
            hotlinePhoneNumber: data.hotlinePhoneNumber,
            hotlinePhoneNumber2: data.hotlinePhoneNumber2,
            hotlineMail: data.hotlineMail,
        };
        console.log(supplierData)
        await axios.patch(`http://127.0.0.1:8000/api/supplier/${idSupplier.idSupplier}`, supplierData, { headers }).then((response) => {
            if (response.status === 200) {
                window.location.reload();
            }
        }).catch((error) => {
            setErrMail(formatErrMsg(error.response.data.message));
        })
    }

    useEffect(() => {
        const fecthData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/supplier/${idSupplier.idSupplier}`, { headers }).then((response) => {
                setSupplier(response.data.data.data)
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
                    <DialogTitle>Modifier fournisseur</DialogTitle>
                    <DialogContent className='modalForm'>
                        <div className="modal-form-supplier">
                            <label>Fournisseur</label>
                            <input type="text" name='nameCompagny' value={ data.nameCompagny || supplier.nameCompagny || ''} onChange={handleChange}/> 
                        </div>
                        <div className="modal-form-supplier">
                            <label>email hotline</label>
                            <input type="text" name='hotlineMail' value={data.hotlineMail || supplier.hotlineMail || ''} onChange={handleChange}/>    
                        </div>   
                        <div className="modal-form-supplier">
                            <label>Téléphone hotline 1</label>
                            <input type="text" name='hotlinePhoneNumber' value={data.hotlinePhoneNumber || supplier.hotlinePhoneNumber || ''} onChange={handleChange}/>
                            
                        </div>
                        <div className="modal-form-supplier">
                            <label>Téléphone hotline 2</label>
                            <input type="text" name='hotlinePhoneNumber2' value={data.hotlinePhoneNumber2 || supplier.hotlinePhoneNumber2 || ''} onChange={handleChange}/>  
                        </div>
                        {errMail ? <span className='errMsg'>{errMail}</span> : null}
                        <div className="modal-form-supplier">
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

export default UpdateSupplierForm
