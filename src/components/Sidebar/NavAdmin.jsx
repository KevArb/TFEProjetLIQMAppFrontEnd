// eslint-disable-next-line no-unused-vars
import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faList, faUserPlus, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

const NavAdmin = () => {

    const navigateTo = useNavigate();

    const newEquipment = async () => {
        return navigateTo('/newEquipment')
    };

    const newMaintenance = async () => {
        return navigateTo('/newMaintenance')
    };

    const newService = async () => {
        return navigateTo('/listServices')
    };

    const newSupplier = async () => {
        return navigateTo('/listSuppliers')
    };

    const newCategory = async () => {
        return navigateTo('/newCategory')
    };
    
    return (
        <div>
                <br />
                <div className="parameter-block">
                    <div className="bottom-item recent-entry">
                        <img src={assets.setting_icon} alt="" />
                        <p>Paramétrage</p>
                    </div>
                    <div onClick={newEquipment} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faSquarePlus} size='2x'/>
                        <p>Gestion équipement</p>
                    </div>
                    <div onClick={newMaintenance} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faFileCirclePlus} size='2x'/>
                        <p>Ajouter maintenance</p>
                    </div>
                    <div onClick={newService} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faList} size='2x'/>
                        <p>Liste des services</p>
                    </div>
                    <div onClick={newSupplier} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faList} size='2x'/>
                        <p>Liste des fournisseurs</p>
                    </div>
                    {/* <div onClick={newCategory} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faList} size='2x'/>
                        <p>Liste des catégorie</p>
                    </div> */}
                    <div onClick={newCategory} className="bottom-item recent-entry">
                        <FontAwesomeIcon icon={faUserPlus} size='2x'/>
                        <p>Gestion Utilisateurs</p>
                    </div>
                </div>
        </div>
    )
}

export default NavAdmin
