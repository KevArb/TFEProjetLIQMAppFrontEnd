// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from '../Sidebar/Sidebar';
import './css/NewMaintenanceForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Fab} from '@mui/material';


const NewMaintenanceForm = () => {

    const token = Cookies.get('token');
    const [role, setRole] = useState([]);
    const [nbStep, setNbStep] = useState(1);
    const [fields, setFields] = useState([]);
    const [equipments, setEquipments] = useState([])
    const [data, setData] = useState({
        name: '',
        steps: [{
            number: 0,
            title: '',
            description: ''
        }],
        equipment: '',
    });
    const [errMsgTitle, setErrMsgTitle] = useState('');
    const [errMsgEquipment, setErrMsgEquipment] = useState('');
    const [errMsgStep, setErrMsgStep] = useState('');

    const addField = () => {
        setFields([...fields, {number: nbStep, title: '', description: ''}]);
        incrementStep();
    };

    const incrementStep = () => (
        setNbStep(nbStep => nbStep + 1)
    )

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
    };

    const handleChangeOnArray = (index, e) => {
        const newFields = [...fields];
        const value = e.target.value;
        newFields[index][e.target.name] = value;
        setFields(newFields);
    };

    const removeStep = async () => {

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const maintenanceData = {
            equipment: data.equipment,
            name: data.name,
            steps: fields,
        };

        console.log(maintenanceData);


        try {
            await axios.post('http://127.0.0.1:8000/api/maintenance/newMaintenance2', maintenanceData, {
                headers: {'Authorization': 'Bearer ' + token}
            }).then((response) => { 
                console.log(response);
                window.location.reload();
            });            
        } catch (error) {
            console.log(error);
            if (maintenanceData.equipment === '') {setErrMsgEquipment('Veuillez renseigner un équipement')}
            if (maintenanceData.name === '') { setErrMsgTitle('Veuillez renseigner un titre') } 
            if (maintenanceData.steps.length == 0) { setErrMsgStep('Veuillez renseigner au moins une étape')}
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            axios.get("http://127.0.0.1:8000/api/equipment", {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                setRole(response.data.role);
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data[key]
                        setEquipments(value)
                    }
                } 
            }).catch((error) => {
                console.log(error)
                
            })
        }
        fetchData();
    }, [])
    
    return (
        <div className='container-maintenance-form'>
            <Sidebar userRole={role} />
            <form className='maintenance-form' onSubmit={handleSubmit}>
                <div className='form-fields'>
                    <h1>Nouvelle maintenance</h1>
                    <FormControl>
                        <InputLabel>Equipement</InputLabel>
                        <Select className='select-field' name='equipment' value={data.equipment} onChange={handleChange}>
                            {equipments.map((equipment) => {
                                    return(
                                        <MenuItem className='select-value' key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem> 
                                    )                   
                                })}
                        </Select>
                        {errMsgEquipment ? <span className='error-message-login'>{errMsgEquipment}</span> : null}
                    </FormControl>
                    <TextField type="text" name='name' value={data.name} placeholder='Titre' onChange={handleChange}/>
                    {errMsgTitle ? <span className='error-message-login'>{errMsgTitle}</span> : null}
                    {fields.map((field, index) => {
                        return (
                        <div className='maintenace-step' key={index}>
                            <div className="number-step">
                                <h3 name='number' value={data.steps.number}>{field.number}</h3>
                            </div>
                            <div className='title-step'>
                                <TextField type="text" name='title' placeholder='Tire' value={data.steps.title} onChange={(e) => handleChangeOnArray(index, e)}/>
                            </div>
                            <div className="description-step">
                                <TextField type="text" name='description' placeholder='description' value={data.steps.description} onChange={(e) => handleChangeOnArray(index, e)}/>
                            </div> 
                            <Fab color="primary" onClick={removeStep} className='remove-step'>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </Fab>
                        </div>)    
                    })}
                    
                    <Button className='btn-add-step' type='button' onClick={addField}><FontAwesomeIcon icon={faCirclePlus} size='2x'/></Button>
                    {errMsgStep ? <span className='error-message-login'>{errMsgStep}</span> : null}
                    <Button type='submit'>Confirmer</Button>
                    
                </div>            
            </form>           
        </div>
    )
}

export default NewMaintenanceForm
