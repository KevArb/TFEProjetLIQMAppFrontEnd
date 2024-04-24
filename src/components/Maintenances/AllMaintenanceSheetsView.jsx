// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faTriangleExclamation, faCircleCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../Sidebar/Sidebar'
import './css/ListSheets.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody  } from '@mui/material'
import {formatDateTime} from '../../utils/functions/Library'

const AllMaintenanceSheetsView = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const navigateTo = useNavigate()
    const [role, setRole] = useState([])
    const [maintenanceSheets, setMaintenanceSheets] = useState([])
    const showMaintenanceSheet = (idMaintenance) => {
        return navigateTo(`/${idMaintenance}/fm`)
    }

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
        fetchData()
    }, [])

    return (
        <div className='container-sheets-list'>
            <Sidebar userRole={role}/>
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
