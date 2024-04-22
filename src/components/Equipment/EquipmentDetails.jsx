// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './css/EquipmentDetail.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import Sidebar from '../Sidebar/Sidebar'
import ArchiveButton from './ArchiveButton'
import { assets } from '../../assets/assets'
import { Chip} from '@mui/material'
import { formatDateTime } from '../../utils/functions/Library';

const EquipmentDetails = () => {
    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const {id} = useParams();
    const [equipment, setEquipment] = useState([]);
    const [maintenanceSheets, setMaintenanceSheets] = useState([]);
    const [role, setRole] = useState([]);
    let incidents = []
    let maintenances = []
    const navigateTo = useNavigate();

    const showMaintenance = ( idMaintenance ) => {
        return navigateTo(`/${idMaintenance}/fm`)
    }

    const showIncident = ( idIncident ) => {
        return navigateTo(`/${idIncident}/incident`)
    }

    const deleteEquipment = async () => {
        await axios.delete(`http://127.0.0.1:8000/api/equipment/${id}`).then(response => {
            console.log(response)
            if (response.status === 204) {
                return navigateTo('/')
            }
        })
    }

    const newMaintenanceSheet = async (idMaintenance) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/maintenanceSheet/${idMaintenance}/newSheet`, { headers }).then((response) => {
                console.log(response)
                if (response.status === 201) {
                    window.location.reload();   
                } 
            }).catch((error) => {
                console.log(error)
            }) 
        } catch (error) {
            console.log(error)
        }

    }
    
    // Fetch equipment data
    useEffect(() => {
        const fetchData = async () => { 
            await axios.get(`http://127.0.0.1:8000/api/equipment/${id}`, { headers }).then((response) => {
                setEquipment(response.data);
                setRole(response.data.role)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setEquipment(value) 
                        console.log(value)        
                    }
                }       
            }).catch ((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    return console.log('error')
                }
            })
        }
        fetchData(); 
    }, [])
    
    if (typeof equipment.incidents === 'object') {
        incidents = equipment.incidents
        console.log(incidents)
    }

    if (typeof equipment.maintenances === 'object') {
        maintenances = equipment.maintenances
    }

    // fetch maintenance sheets data `http://127.0.0.1:8000/api/equipment/${id}/maintenanceSheet/byEquipment`
    useEffect(() => {
        const fetchData = async () => { 
            await axios.get(`http://127.0.0.1:8000/api/equipment/${id}/maintenanceSheet/?isValidate=false`, { headers }).then((response) => {
                console.log(response.data)
                setMaintenanceSheets(response.data);
                setRole(response.data.role)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data[key]
                        setMaintenanceSheets(value)       
                    }
                }    
            }).catch ((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    return console.log('error')
                }
            })
        }
        fetchData(); 
    }, [])
    
    return (
        <div className='container'>
            <Sidebar userRole={role}/>
            <div className="container-equipment">
                <div className="equipment-card">
                    <div className="equipment-title">
                        <h1>{equipment.name}</h1>
                    </div>
                    <div className="equipment-img">
                        <img src={assets.dummy} alt="" />
                        {/* <p>{equipment.image}</p> */}
                        {/* <image src={equipment.image} alt="" /> */}
                    </div>
                    <div className="equipment-details">
                        <h2>Détails : </h2>
                        <label>Code :</label>
                        <p>{equipment.code}</p>
                        <label>Description :</label>
                        <p>{equipment.description}</p>
                        <label>Serial Number :</label>
                        <p>{equipment.serialNumber}</p>
                        {/* <p>{equipment.service}</p> */}
                        {/* <p>{equipment.category}</p> */}
                        {/* <p>{equipment.service}</p> */}
                        {/* <p>{equipment.supplier}</p> */}
                        {/* <p>{equipment.nbIncidents}</p> */}
                    </div>

                    <div className="equipment-incident">
                        <div className="header-incident">
                            <h2>Incident en cours</h2>
                            <div className='add-btn'>
                                <img className='add-img' src={assets.addIcon}></img>
                            </div>
                        </div>
                        {/* <h2>Incident en cours</h2>
                        <div className="new-incident-btn">
                                <div className='add-btn'>
                                    <img className='add-img' src={assets.addIcon}></img>
                                </div>
                        </div> */}
                        {/* <Link to={`/`} > */}
                        <div className="incidents-view">
                                {incidents.map((el) => {
                                    return(
                                        <div key={el.id}>
                                            <div onClick={() => showIncident(el.id)} className='link-incident'>
                                            {/* <Link className='link-incident' to={`/${el.id}/incident`}> */}
                                                <div className='card-details'>
                                                    <div>
                                                        <p>{el.title}</p>
                                                    </div>
                                                    <div>
                                                        <p>{el.description}</p>
                                                    </div>
                                                    <div>
                                                        <p>{formatDateTime(el.dateTimeOfIncident)}</p>
                                                    </div>
                                                    <div>
                                                        <p>{el.createdBy}</p>
                                                    </div>
                                                    <div className='incident-label'>                                                     
                                                        <Chip label={el.impact} />
                                                        <Chip label={el.status} />
                                                    </div>                                
                                                </div> 
                                            {/* </Link>  */}
                                            </div>
                                            <div className='sep-incident'></div>
                                        </div>
                                        
                                    )                   
                                })}
                                
                            </div>

                        {/* <Link/> */}
                    </div>

                    <div className="equipment-maintenance">
                        <h2>Maintenances</h2>

                        <div>
                            {maintenances.map((el) => {
                                return (
                                    <div className="maintenances-view" key={el.id}> 
                                        <div>
                                            <p>{el.name}</p>
                                        </div>
                                        <div className='add-btn' onClick={() => newMaintenanceSheet(el.id)}>
                                            <img className='add-img' src={assets.addIcon}></img>
                                        </div>
                                        {/* <Link onClick={newMaintenanceSheet} to={'/{el.id}/newSheet'}>Start sheet</Link> */}
                                        
                                    </div>                                   
                                )
                            })}
                        </div>
                    </div>


                    <div className="equipment-maintenance-start">
                        <h2>Maintenances en cours</h2>
                        <div>
                            {maintenanceSheets.map((ms) => {
                                return(
                                    <div onClick={() => showMaintenance(ms.id)} className="maintenace-view" key={ms.id}>
                                            <div>
                                                <p>{ms.name}</p>   
                                            </div>
                                            <div>
                                            </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <div className="equipment-details-action">
                        <ArchiveButton className='btn-action' equipment={equipment} />
                        {role === 'admin' ? <button className='btn-action' onClick={deleteEquipment}>Supprimer</button> : <div></div>}
                        <Link className='btn-action' to={`/equipment-details-update/${id}`}><button>Modifier</button></Link>
                    </div>
                </div>
                 
            </div>   
        </div>
    )
}

export default EquipmentDetails
