// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import UpdateSupplierForm from './UpdateSupplierForm';
import NewSupplierForm from './NewSupplierForm';
import Cookies from 'js-cookie';

const ListSupplierView = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const [form, setForm] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [idSupplier, setIdSuppleir] = useState('');
    const [newServiceForm, setNewServiceForm] = useState(false);
    const [filterAll, setFilterAll] = useState(true)

    const updateSupplier = ( idSupplier ) => {
        setForm(!form);
        setIdSuppleir(idSupplier)
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
                await axios.get(`http://127.0.0.1:8000/api/supplier/`, { headers }).then((response) => {
                    setSuppliers(response.data.data);
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
                                    Mail
                                </TableCell>
                                <TableCell>
                                    Téléphone 1
                                </TableCell>
                                <TableCell>
                                    Téléphone 2
                                </TableCell>
                                <TableCell>
                                    isUsed
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {suppliers?.map((supplier) => {
                                return (
                                    <TableRow onClick={() => updateSupplier(supplier.id)} key={supplier.id} className='incident-table-row-incident' >
                                        <TableCell >{supplier.nameCompagny}</TableCell>
                                        <TableCell >{supplier.hotlineMail}</TableCell>
                                        <TableCell >{supplier.hotlinePhoneNumber}</TableCell>
                                        <TableCell >{supplier.hotlinePhoneNumber2}</TableCell>
                                        <TableCell >
                                            {
                                                supplier.isUsed ? <div><Checkbox checked/></div> : <div><Checkbox /></div>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div>
                    { newServiceForm ? <div><NewSupplierForm /></div> : <div></div> }
                </div>
                <div>
                    { form ? <div><UpdateSupplierForm idSupplier={idSupplier} /></div> : <div></div> }
                </div>
        </div>
    )
}

export default ListSupplierView
