// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import NewServiceForm from './NewServiceForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import UpdateServiceForm from './UpdateServiceForm';
import Cookies from 'js-cookie';

const ListServiceView = () => {


    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [form, setForm] = useState(false);
    const [services, setServices] = useState([]);
    const [idService, setIdService] = useState('');
    const [newServiceForm, setNewServiceForm] = useState(false);
    const [filterAll, setFilterAll] = useState(true)

    const updateService = ( idService ) => {
        setForm(!form);
        setIdService(idService)
    }

    const newService = () => {
        setNewServiceForm(!newServiceForm);
    }

    const filterByIused = () => {
        setFilterAll(!filterAll);
    }

    useEffect(() => {
        if (filterAll) {
            const fecthData = async () => {
                await axios.get(`http://127.0.0.1:8000/api/service/`, { headers }).then((response) => {
                    setServices(response.data.data);
                }).catch((error) => {
                    console.log(error);
                })
            }
            fecthData();
        } else {
            const fecthData = async () => {
                await axios.get(`http://127.0.0.1:8000/api/service/`, { isUsed : true}, { headers }).then((response) => {
                    setServices(response.data.data);
                }).catch((error) => {
                    console.log(error);
                })
            }
            fecthData();
        }
    }, [])

    return (
        <div className='container-incidents-list'>
            <Sidebar />
            <TableContainer className='incidents-table-container'>
                    <FormGroup >
                        <div className='filter-check'>
                            <div>
                                <FormControlLabel control={<Checkbox  onChange={filterByIused} checked={filterAll}/>} label="Tous" />
                            </div>
                            <div>
                                <FormControlLabel control={<Checkbox onChange={filterByIused} checked={!filterAll}/>} label="isUsed" />
                            </div> 
                            <div onClick={newService}>
                                <FontAwesomeIcon icon={faCirclePlus} size='2x'/>
                            </div>
                        </div> 
                    </FormGroup>
                    <Table className='incidents-table'>
                        <TableHead>
                            <TableRow >
                                <TableCell>
                                    Nom
                                </TableCell>
                                <TableCell>
                                    isUsed
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services?.map((service) => {
                                return (
                                    <TableRow onClick={() => updateService(service.id)} key={service.id} className='incident-table-row-incident' >
                                        <TableCell >{service.name}</TableCell>
                                        <TableCell >
                                            {
                                                service.isUsed ? <div><Checkbox checked/></div> : <div><Checkbox /></div>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div>
                    { newServiceForm ? <div><NewServiceForm /></div> : <div></div> }
                </div>
                <div>
                    { form ? <div><UpdateServiceForm idService={idService} /></div> : <div></div> }
                </div>
        </div>
    )
}

export default ListServiceView
