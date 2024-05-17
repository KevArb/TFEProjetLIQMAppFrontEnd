// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faList, faUserPlus, faFileCirclePlus, faWrench } from '@fortawesome/free-solid-svg-icons';

const NavAdmin = () => {

    const navigateTo = useNavigate()

    const newEquipment =  () => {
        return navigateTo('/newEquipment')
    };

    const newMaintenance =  () => {
        return navigateTo('/newMaintenance')
    };

    const newService =  () => {
        return navigateTo('/listServices')
    };

    const newSupplier =  () => {
        return navigateTo('/listSuppliers')
    };

    // const newCategory =  () => {
    //     return navigateTo('/newCategory')
    // };
    
    const listMaintenance =  () => {
        return navigateTo('/listMaintenances')
    };

    const listUser = () => {
        return navigateTo('/listUser')
    }
    
    return (
        <div>
            <div className="parameter-block">
                <div onClick={newEquipment} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faSquarePlus} size='2x'/>
                    <p>Gestion équipement</p>
                </div>
                <div onClick={newMaintenance} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faFileCirclePlus} size='2x'/>
                    <p>Ajouter maintenance</p>
                </div>
                <div onClick={listMaintenance} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faWrench} size='2x'/>
                    <p>Gestion des maintenances</p>
                </div>
                <div onClick={newService} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faList} size='2x'/>
                    <p>Liste des services</p>
                </div>
                <div onClick={newSupplier} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faList} size='2x'/>
                    <p>Liste des fournisseurs</p>
                </div>
                <div onClick={listUser} className="bottom-item recent-entry">
                    <FontAwesomeIcon icon={faUserPlus} size='2x'/>
                    <p>Gestion Utilisateurs</p>
                </div>
            </div>
        </div>
    )
}

export default NavAdmin
