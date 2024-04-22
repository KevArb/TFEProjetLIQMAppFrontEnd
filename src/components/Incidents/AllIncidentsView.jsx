// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './css/ListIncidents.css';
import { formatDateTime } from '../../utils/functions/Library';
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import './css/ListIncidents.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControlLabel, FormGroup  } from '@mui/material';


const AllIncidentsView = () => {

    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const navigateTo = useNavigate();

    const [role, setRole] = useState([]);
    const [incidents, setIncidents] = useState([]);

    const editIncident = (idIncident) => {
        return navigateTo(`/${idIncident}/incident`)
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident`, { headers }).then((response) => {
                setIncidents(response.data.data);
                setRole(response.data.role);
            }).catch((error) => {
                console.log(error);
            })
        }
        fetchData();
    }, [])

    return (
        <div className='container-incidents-list'>
            <Sidebar userRole={role}/>
            <TableContainer className='incidents-table-container'>
                <FormGroup >
                    <div className='filter-check'>
                        <div>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Tous" />
                        </div>
                        <div>
                            <FormControlLabel control={<Checkbox />} label="En Cours" />
                        </div> 
                    </div> 
                </FormGroup>
                <Table className='incidents-table'>
                    <TableHead>
                        <TableRow >
                            <TableCell>
                                Incident
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Impact
                            </TableCell>    
                            <TableCell>
                                Date
                            </TableCell>
                            <TableCell>
                                Titre
                            </TableCell>
                            <TableCell>
                                Equipement
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incidents?.map((incident) => {
                            return (
                                <TableRow onClick={() => editIncident(incident.id)} key={incident.id} className='incident-table-row-incident'>
                                    <TableCell >{incident.code}</TableCell>
                                    <TableCell >{incident.status}</TableCell>
                                    <TableCell >{incident.impact}</TableCell>
                                    <TableCell >{formatDateTime(incident.dateTimeOfIncident)}</TableCell>
                                    <TableCell >{incident.title}</TableCell>
                                    <TableCell >{incident.equipment.code}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AllIncidentsView
