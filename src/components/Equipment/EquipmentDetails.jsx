// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './css/EquipmentDetail.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import Sidebar from '../Sidebar/Sidebar'
import ArchiveButton from './ArchiveButton'
import { assets } from '../../assets/assets'
import { Chip } from '@mui/material'
import { formatDateTime } from '../../utils/functions/Library'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import ModalFormNewIncident from '../Incidents/ModalFormNewIncident'

const EquipmentDetails = () => {
    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const {id} = useParams()
    const [equipment, setEquipment] = useState([])
    const [maintenanceSheets, setMaintenanceSheets] = useState([])
    const [incidents, setIncidents] = useState([])
    const [role, setRole] = useState([])
    const [openNewIncodentForm, setOpenNewIncodentForm] = useState(false)

    let maintenances = []
    const navigateTo = useNavigate()

    const showMaintenance = ( idMaintenance ) => {
        return navigateTo(`/${idMaintenance}/fm`)
    }

    const showIncident = ( idIncident ) => {
        return navigateTo(`/${idIncident}/incident`)
    }

    const addNewIncident = () => {
        setOpenNewIncodentForm(!openNewIncodentForm)
    }

    const deleteEquipment = async () => {
        await axios.delete(`http://127.0.0.1:8000/api/equipment/${id}`).then(response => {
            
            if (response.status === 204) {
                return navigateTo('/')
            }
        })
    }

    const chipLabelCustom = (status) => {
        // if (status === 'En cours') return <div><Chip label={status} className='chip-started'/></div> En attente d'une action
        if (status === 'En cours') return <div><Chip label={status} style={{backgroundColor:'#98C2A7'}}/></div>
        if (status === 'En attente') return <div><Chip label={status} style={{backgroundColor:'#DEB7FF'}}/></div>
        if (status === 'Clarification') return <div><Chip label={status} style={{backgroundColor:'#effba2'}}/></div>
        if (status === "En attente d'une action") return <div><Chip label={status} style={{backgroundColor:'#DEB7FF'}}/></div>
        if (status === 'Urgent') return <div><Chip label={status} style={{backgroundColor:'#ff2e0d'}}/></div>
        if (status === 'Bas') return <div><Chip label={status} style={{backgroundColor:'#058beb'}}/></div>
        if (status === 'Moyen') return <div><Chip label={status} style={{backgroundColor:'#DEB7FF'}}/></div>
        if (status === 'En erreur' || status === 'Haut') return <div><Chip label={status} style={{backgroundColor:'#ffa600'}}/></div> 
    }

    const newMaintenanceSheet = async (idMaintenance) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/maintenanceSheet/${idMaintenance}/newSheet`, { headers }).then((response) => {
                if (response.status === 201) {
                    window.location.reload()   
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
                setEquipment(response.data)
                setRole(response.data.role)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setEquipment(value)        
                    }
                }       
            }).catch ((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    return console.log('error')
                }
            })
        }
        fetchData() 
    }, [])
    
    if (typeof equipment.maintenances === 'object') {
        maintenances = equipment.maintenances
    }

    // fetch maintenance sheets data 
    useEffect(() => {
        const fetchData = async () => { 
            await axios.get(`http://127.0.0.1:8000/api/equipment/${id}/maintenanceSheet/?isValidate=false`, { headers }).then((response) => {
                setMaintenanceSheets(response.data)
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
        fetchData() 
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipment/${id}/incident/getIncidents/?isClosed=false`, { headers }).then((response) => {
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setIncidents(value)       
                    }
                } 
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
    }, [])

    console.log(equipment)
    
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
                    </div>
                    <div className="equipment-details">
                        <h2>Détails : </h2>
                        <label>Code :</label>
                        <p>{equipment.code}</p>
                        <label>Description :</label>
                        <p>{equipment.description}</p>
                        <label>Serial Number :</label>
                        <p>{equipment.serialNumber}</p>
                    </div>
                    {/* <div className='equipment-contacts'>
                        <h2>Contacts</h2>
                        <p>Fournisseur : {equipment.supplier.nameCompagny}</p>
                        <p>Mail : {equipment.supplier.hotlineMail}</p>
                        <p>Téléphone : {equipment.supplier.hotlinePhoneNumber}</p> 
                    </div> */}
                    <div className="equipment-incident">
                        <div className="header-incident">
                            <h2>Incident en cours</h2>
                            <div>
                                <FontAwesomeIcon onClick={addNewIncident} className='add-btn' icon={faCirclePlus} />
                            </div>     
                        </div>
                        {openNewIncodentForm ? <div><ModalFormNewIncident idEquipment={id} /></div> : null}
                        <div className="incidents-view">
                                {incidents?.map((el) => {
                                    return(
                                        <div key={el.id}>
                                            <div onClick={() => showIncident(el.id)} className='link-incident'>
                                                <div className='card-details'>
                                                    <div>
                                                        <p>{el.title}</p>
                                                    </div>
                                                    <div>
                                                        <p>{el.description}</p>
                                                    </div>
                                                    <div>
                                                        <p>Crée par : {el.createdBy.login}</p>
                                                    </div>
                                                    <div>
                                                        <p>{formatDateTime(el.dateTimeOfIncident)}</p>
                                                    </div>
                                                    <div className='incident-label'>                                                     
                                                        {chipLabelCustom(el.status)}
                                                        {chipLabelCustom(el.impact)}
                                                    </div>                                
                                                </div> 
                                            </div>
                                            <div className='sep-incident'></div>
                                        </div>                                       
                                    )                   
                                })}
                            </div>
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
                                                <p>Démarrée par : {ms.startedBy.login}</p>
                                                <p>le : {formatDateTime(ms.startedBy.createdAt)}</p>  
                                            </div>
                                            {chipLabelCustom(ms.finalStatus)}                                               
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
