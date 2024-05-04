// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTriangleExclamation, faCircleCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../Sidebar/Sidebar'
import './css/ListSheets.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogContent, Button, Select, MenuItem  } from '@mui/material'
import {formatDateTime} from '../../utils/functions/Library'
import { headers } from '../../utils/functions/constLibrary'

const AllMaintenanceSheetsView = () => {

    const navigateTo = useNavigate()
    const [role, setRole] = useState([])
    const [maintenanceSheets, setMaintenanceSheets] = useState([])
    const showMaintenanceSheet = (idMaintenance) => {
        return navigateTo(`/${idMaintenance}/fm`)
    }

    const [data, setData] = useState({
        status: 'Toutes'
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
            const dataFilter = {
                finalStatus: data.status
            }
            await axios.get(`http://127.0.0.1:8000/api/maintenanceSheet`, { headers }).then((response) => {
                setMaintenanceSheets(response.data.data)
                setRole(response.data.role)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
    }, [])

    const handleChangeStatusFilter = (e) => {
        const value = e.target.value
        setData({
            ...data,
            [e.target.name]: value
        })

    }
    console.log(data)

    return (
        <div className='container-sheets-list'>
            <div>
                <Sidebar userRole={role}/>
            </div>
            <div>
                <Select name='status' onChange={handleChangeStatusFilter} defaultValue='Toutes'>
                    <MenuItem value='Toutes'>Toutes</MenuItem>
                    <MenuItem value='En cours'>En cours</MenuItem>
                    <MenuItem value='En attente'>En attente</MenuItem>
                    <MenuItem value='En erreur'>En erreur</MenuItem>
                    <MenuItem value='Terminée'>Terminée</MenuItem>
                    <MenuItem value='Discontinué'>Discontinué</MenuItem>
                </Select>
                <Button>Filtre</Button>
                <Dialog open={!open}>
                    <DialogContent>
                        <p>Status</p>
                    </DialogContent>
                </Dialog>
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
                                    Date
                                </TableCell>
                                <TableCell>
                                    Equipement
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {maintenanceSheets?.map((sheet) => {
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
