// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../Sidebar/Sidebar'
import './css/ListSheets.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControlLabel } from '@mui/material'
import {formatDateTime} from '../../utils/functions/Library'
import Cookies from 'js-cookie'

const AllMaintenances = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }

    const [role, setRole] = useState([])
    const [maintenances, setMaintenances] = useState([])

    const handleArchiveMaintenance = async (id, maintenanceIsUsed) => {
        const data = {
            isUsed: !maintenanceIsUsed
        }
        console.log(data)
        await axios.patch(`http://127.0.0.1:8000/api/maintenance/getMaintenance/${id}`, data, { headers }).then((response) => {
            if (response.status === 200) {
                window.location.reload()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenance`, { headers }).then((response) => {
                setRole(response.data.role)
                setMaintenances(response.data.data)
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
                                  <TableCell>
                                    Code
                                </TableCell>
                                <TableCell>
                                    Maintenance
                                </TableCell>   
                                <TableCell>
                                    Date
                                </TableCell>
                                <TableCell>
                                    Equipement
                                </TableCell>
                                <TableCell>
                                    isUsed
                                </TableCell>
                                <TableCell>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {maintenances?.map((maintenance) => {
                                return (
                                    <TableRow key={maintenance.id}>
                                        <TableCell>{maintenance.code}</TableCell>
                                        <TableCell>{maintenance.name}</TableCell>
                                        <TableCell>{formatDateTime(maintenance.createdAt)}</TableCell>
                                        <TableCell>{maintenance.equipment.name}</TableCell> 
                                        <TableCell>
                                            <FormControlLabel control={ <Checkbox name='isUsed' onClick={() => handleArchiveMaintenance(maintenance.id, maintenance.isUsed)} checked={maintenance.isUsed}/> } />
                                        </TableCell>                                           
                                    </TableRow>
                                )
                            })} 
                        </TableBody>
                </Table>
            </TableContainer> 
        </div>
    )
}

export default AllMaintenances
