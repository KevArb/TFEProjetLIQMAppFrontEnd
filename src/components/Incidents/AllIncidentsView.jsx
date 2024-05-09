// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './css/ListIncidents.css'
import { formatDateTime } from '../../utils/functions/Library'
import Sidebar from '../Sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
import './css/ListIncidents.css'
import { Button, TableContainer, Select, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogContent, DialogActions, MenuItem } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardQuestion, faFilter, faHourglassStart, faSquareCheck, faCircleCheck, faSpinner, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { headers } from './../../utils/functions/constLibrary'

const AllIncidentsView = () => {

    const navigateTo = useNavigate()
    const [role, setRole] = useState([])
    const [incidents, setIncidents] = useState([])
    const [equipments, setEquipments] = useState([])
    const [filter, setFilter] = useState(false)

    const editIncident = (idIncident) => {
        return navigateTo(`/${idIncident}/incident`)
    }

    const [data, setData] = useState({
        status: 'Tous',
        equipment: 'Tous'
    })

    const handleModalFilter = () => {
        setFilter(!filter)
    }

    const handleOnchangeModal = (e) => {
        const value = e.target.value
        setData({
            ...data, 
            [e.target.name] : value
        })
    }

    const handleFilter = () => {
        // const dataFilter = {
        //     status: data.status,
        //     equipment: data.equipment
        // }
        if (data.status != 'Tous' && data.equipment != 'Tous') {
            const getDataFormFilter = async () => {
                await axios.get(`http://127.0.0.1:8000/api/incident?equipment=${data.equipment}&status=${data.status}`, { headers }).then((response) => {
                    setEquipments(response.data.data)
                    setFilter(!filter)
                }).catch((error) => {
                    console.log(error)
                })
            }
            getDataFormFilter()
        }

    }

    console.log(data)
    const iconStatusMs = (data) => {
        if (data === 'En cours') {
            return (<div><FontAwesomeIcon icon={faSpinner} spin/></div>)
        }
        if (data === "En attente d'une action") {
            return (<div><FontAwesomeIcon icon={faHourglassStart} /></div>)
        }
        if (data === 'Clarification') {
            return (<div><FontAwesomeIcon icon={faClipboardQuestion} /></div>)
        } 
        if (data === 'Résolu') {
            return (<div><FontAwesomeIcon icon={faCircleCheck} /></div>)
        } 
        if (data === 'Clôturé') {
            return (<div><FontAwesomeIcon icon={faSquareCheck} /></div>)
        }         
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/incident`, { headers }).then((response) => {
                setIncidents(response.data.data)
                setRole(response.data.role)
            }).catch((error) => {
                console.log(error)
            })
        }

        const fetchDataEquipment = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipment`, { headers }).then((response) => {
                setEquipments(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
        fetchDataEquipment()
    }, [])

    return (
        <div className='container-incidents-list'>
            <div>
                <Sidebar userRole={role}/>
            </div>
            <div className='filter-actions'>
                <Button onClick={handleModalFilter}><FontAwesomeIcon icon={faFilter} size='2x'/></Button>
                <Button ><FontAwesomeIcon icon={faFilterCircleXmark} size='2x'/></Button>
            </div>
            {filter ? 
            <div>
                <Dialog open={filter}>
                    <DialogContent>
                        <div className='modal-content'>
                            <span>Status</span>
                            <Select name='status' onChange={handleOnchangeModal} defaultValue='Tous'>
                                <MenuItem value='Tous'>Tous</MenuItem>
                                <MenuItem value="En attente d'une action">En attente d&apos;une action</MenuItem>
                                <MenuItem value='Clarification'>Clarification</MenuItem>
                                <MenuItem value='Clôturé'>Clôturé</MenuItem>
                                <MenuItem value='Résolu'>Résolu</MenuItem>
                            </Select>
                            <span>Equipement</span>
                            <Select name='equipment' onChange={handleOnchangeModal} defaultValue='Tous'>
                                <MenuItem value='Tous'>Tous</MenuItem>
                                {equipments?.map((equipment) => {
                                    return ( <MenuItem key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem> )
                                })}
                            </Select>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFilter}>Confirmer</Button>
                        <Button onClick={handleModalFilter}>Annuler</Button>
                    </DialogActions>
                </Dialog>
            </div> : null}
            <div className='table-container'>
                <TableContainer className='incidents-table-container'>
                    <Table className='incidents-table'>
                        <TableHead>
                            <TableRow >
                                <TableCell></TableCell>
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
                            {incidents.sort((a, b) => new Date(b.dateTimeOfIncident) - new Date(a.dateTimeOfIncident))?.map((incident) => {
                                return (
                                    <TableRow onClick={() => editIncident(incident.id)} key={incident.id} className='incident-table-row-incident'>
                                        <TableCell>
                                            {iconStatusMs(incident.status)}
                                        </TableCell>
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
        </div>
    )
}

export default AllIncidentsView
