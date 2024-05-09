// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTriangleExclamation, faCircleCheck, faClockRotateLeft, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../Sidebar/Sidebar'
import './css/ListSheets.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogContent, Button, Select, MenuItem, DialogActions  } from '@mui/material'
import {formatDateTime} from '../../utils/functions/Library'
import { headers } from '../../utils/functions/constLibrary'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllMaintenanceSheetsView = () => {

    const navigateTo = useNavigate()
    const [role, setRole] = useState([])
    const [maintenanceSheets, setMaintenanceSheets] = useState([])
    const [equipments, setEquipments] = useState([])
    const [filter, setFilter] = useState(false)
    const showMaintenanceSheet = (idMaintenance) => {
        return navigateTo(`/${idMaintenance}/fm`)
    }

    const [data, setData] = useState({
        status: 'Toutes',
        equipment: 'Tous',
        startDate: new Date(),
        endDate: new Date()
    })

    const iconStatusMs = (data) => {
        if (data.finalStatus === 'Discontinué') {
            return (<div><FontAwesomeIcon icon={faXmark} className='icon-disc'/></div>)
        }
        if (data.finalStatus === 'En erreur') {
            return (<div><FontAwesomeIcon icon={faTriangleExclamation} beat className='icon-disc'/></div>)
        }
        if (data.finalStatus === 'Fait') {
            return (<div><FontAwesomeIcon icon={faCircleCheck} className='icon-done'/></div>)
        } 
        if (data.finalStatus === 'En attente') {
            return (<div><FontAwesomeIcon icon={faClockRotateLeft} className='icon-wait'/></div>)
        }       
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet`, { headers }).then((response) => {
                setMaintenanceSheets(response.data.data)
                setRole(response.data.role)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fecthDataEquipment = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipment`, { headers }).then((response) => {
                setEquipments(response.data.data)
            }).catch((error) => {
                console.log(error)
            }) 
        }
        fetchData()
        fecthDataEquipment()
    }, [])

    const filterByStatus = () => {
        let urlAPI

        if (data.status != 'Toutes' && data.equipment != 'Tous' ) {
            urlAPI = `http://127.0.0.1:8000/api/maintenanceSheet?finalStatus=${data.status}&equipment=${data.equipment}`
        } else if (data.equipment != 'Tous' ) {
            urlAPI = `http://127.0.0.1:8000/api/maintenanceSheet?equipment=${data.equipment}`
        } else if (data.status != 'Toutes') {
            urlAPI = `http://127.0.0.1:8000/api/maintenanceSheet?finalStatus=${data.status}`
        } else {
            urlAPI = `http://127.0.0.1:8000/api/maintenanceSheet`
        }
        const fetchData = async () => {
            await axios.get(urlAPI, { headers }).then((response) => {
                setMaintenanceSheets(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
        setFilter(!filter)
    }

    const handleChangeStatusFilter = (e) => {
        const value = e.target.value
        setData({
            ...data,
            [e.target.name]: value
        })
    }

    const resetFilter = () => {
        window.location.reload()
    }

    const activateFilter = () => {
        setFilter(!filter)
    }

    return (
        <div className='container-sheets-list'>
            <div>
                <Sidebar userRole={role}/>
            </div>
            <div>
                <Dialog open={filter}>
                    <DialogContent>
                        <div className="filter-modal-form">
                            <span>Status</span>
                            <Select name='status' onChange={handleChangeStatusFilter} defaultValue='Toutes'>
                                <MenuItem value='Toutes'>Toutes</MenuItem>
                                <MenuItem value='En cours'>En cours</MenuItem>
                                <MenuItem value='En attente'>En attente</MenuItem>
                                <MenuItem value='En erreur'>En erreur</MenuItem>
                                <MenuItem value='Fait'>Fait</MenuItem>
                                <MenuItem value='Discontinué'>Discontinué</MenuItem>
                            </Select>
                            <span>Equipement</span>
                            <Select name='equipment' onChange={handleChangeStatusFilter} defaultValue='Tous'>
                                <MenuItem value='Tous'>Tous</MenuItem>
                                {equipments?.map((equipment) => {
                                    return ( <MenuItem key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem> )
                                })}
                            </Select>
                            <div>
                                <DatePicker onChange={(date) => setData({...data, startDate: date})} selected={data.startDate}/>
                                <DatePicker onChange={(date) => setData({...data, endDate: date})} selected={data.endDate}/>
                            </div>
                            <DialogActions>
                                <Button onClick={filterByStatus}>Confirmer</Button>
                                <Button onClick={activateFilter}>Annuler</Button>
                            </DialogActions>       
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='filter-actions'>
                <Button onClick={activateFilter}><FontAwesomeIcon icon={faFilter} size='2x'/></Button>
                <Button onClick={resetFilter}><FontAwesomeIcon icon={faFilterCircleXmark} size='2x'/></Button>
            </div>
            <TableContainer className='sheets-table'>
                <Table className='table'>
                        <TableHead>
                            <TableRow className='sheets-table-row-title'>
                                <TableCell></TableCell>
                                <TableCell>
                                    Feuille de maintenance
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>   
                                <TableCell>
                                    Démarrée le
                                </TableCell>
                                <TableCell>
                                    Equipement
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {maintenanceSheets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((sheet) => {
                                return (
                                    <TableRow onClick={() => showMaintenanceSheet(sheet.id)} key={sheet.id} className='sheet-table-row-sheet'>
                                        <TableCell>
                                            {iconStatusMs(sheet)}
                                        </TableCell>
                                        <TableCell>{sheet.name}</TableCell>
                                        <TableCell>
                                            { sheet.finalStatus === 'Fait' ? <div>{sheet.finalStatus}</div> : <div>{sheet.finalStatus}</div>} 
                                        </TableCell>
                                        <TableCell>{formatDateTime(sheet.createdAt)}</TableCell>
                                        <TableCell>{sheet.equipment.code}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AllMaintenanceSheetsView
