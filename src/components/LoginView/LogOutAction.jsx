// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket} from '@fortawesome/free-solid-svg-icons'


const LogOutAction = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        logout()
        navigate('/')
    }

    return (
        <div>
            <div onClick={handleLogOut} className="bottom-item recent-entry">
                <FontAwesomeIcon icon={faRightFromBracket} size='2x'/>
                <p>Log Out</p>    
            </div>    
        </div>
    )
}

export default LogOutAction
