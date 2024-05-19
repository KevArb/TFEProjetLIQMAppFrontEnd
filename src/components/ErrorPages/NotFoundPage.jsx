// eslint-disable-next-line no-unused-vars
import React from 'react'
import './ErrorPage.css'
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div>
            <div className='container-error-page'>
                <h1>Erreur 404</h1>
                <span>Page non trouvée</span>
                <Link className="link" to={`/equipments`}>Revenir</Link>
            </div>    
        </div>
    )
}

export default NotFoundPage
