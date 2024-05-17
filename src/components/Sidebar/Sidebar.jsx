// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import NavAdmin from './NavAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriverWrench, faToolbox, faSheetPlastic, faUser } from '@fortawesome/free-solid-svg-icons'
import { Avatar } from '@mui/material'
import { AuthProvider } from '../LoginView/AuthProvider'
import LogOutAction from '../LoginView/LogOutAction'
import Cookies from 'js-cookie'

const Sidebar = () => {
    
    const userRole = Cookies.get('userRole')
    const userLogin = Cookies.get('userLogin')
    const navigateTo = useNavigate()
    const equipmentView = async () => {
        return navigateTo('/')
    }

    const incidentsListView = () => {
        return navigateTo('/incidents')
    }

    const maintenanceListView = () => {
        return navigateTo('/maintenance-sheet')
    }

    const getProfileData = () => {
        return navigateTo('/profile')
    }

    return (
        <div className='sidebar'>
            <div className="top">
                <div className='user-section'>
                    <Avatar alt="Remy Sharp" src="" />
                    <h2>{userLogin}</h2>  
                </div>
                <div onClick={equipmentView} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faScrewdriverWrench} size='2x'/>
                    <p className='txt'>Equipements</p> 
                </div>
                <div onClick={maintenanceListView } className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faToolbox} size='2x'/>
                    <p className='txt'>FM</p>
                </div>
                <div onClick={incidentsListView} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faSheetPlastic} size='2x'/>
                    <p className='txt'>Incidents</p>
                </div> 
            </div>  
            {userRole === 'admin' || userRole === 'manager' ? <div><NavAdmin/></div> : <div></div>} 
            <div className="bottom">
                <div onClick={getProfileData} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faUser} size='2x'/>
                    <p>Profile</p>
                </div>
                <AuthProvider>
                    <LogOutAction />
                </AuthProvider>
            </div>
        </div>
    )
}

export default Sidebar
