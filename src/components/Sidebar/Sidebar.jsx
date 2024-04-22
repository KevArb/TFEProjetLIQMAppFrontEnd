// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NavAdmin from './NavAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench, faToolbox, faSheetPlastic, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const Sidebar = ( userRole ) => {

    const navigateTo = useNavigate();
    const equipmentView = async () => {
        return navigateTo('/')
    };

    const incidentsListView = () => {
        return navigateTo('/incidents')
    };

    const maintenanceListView = () => {
        return navigateTo('/maintenance-sheet')
    };

    const getProfileData = () => {
        return navigateTo('/profile')
    }

    const logOut = async () => {
        Cookies.remove('token')
        return navigateTo('/login')
    };

    return (
        <div className='sidebar'>
            <div className="top">
                {/* <div onClick={equipmentView} className="logo">
                    <img className='logo-img' src={assets.laboratory} alt="" />
                </div> */}
                <div onClick={equipmentView} className="bottom-item recent-entry">
                    {/* <img src={assets.history_icon} alt="" /> */}
                    <FontAwesomeIcon icon={faScrewdriverWrench} size='2x'/>
                    <p className='txt'>Equipements</p> 
                </div>
                <div onClick={maintenanceListView } className="bottom-item recent-entry">
                    {/* <img src={assets.setting_icon} alt="" /> */}
                    <FontAwesomeIcon icon={faToolbox} size='2x'/>
                    <p className='txt'>FM</p>
                </div>
                <div onClick={incidentsListView} className="bottom-item recent-entry">
                    {/* <img src={assets.setting_icon} alt="" /> */}
                    <FontAwesomeIcon icon={faSheetPlastic} size='2x'/>
                    <p className='txt'>Incidents</p>
                </div> 
            </div>  
            {userRole.userRole === 'admin' || userRole.userRole === 'manager' ? <div><NavAdmin /></div> : <div></div>} 
            <div className="bottom">
                <div onClick={getProfileData} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faUser} size='2x'/>
                    <p>Profile</p>
                </div>
                <div onClick={logOut} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faRightFromBracket} size='2x'/>
                    <p>Log Out</p>    
                </div>
            </div>
        </div>
    )
}

export default Sidebar
