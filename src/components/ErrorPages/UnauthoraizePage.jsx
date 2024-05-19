// eslint-disable-next-line no-unused-vars
import React from 'react'
import './ErrorPage.css'
import { Link } from 'react-router-dom';

const UnauthoraizePage = () => {
    return (
        <div>
            <div className='container-error-page'>
                <h1>Erreur 403</h1>
                <span>Vous n&apos;avez pas ls droits pour accèder à cette page</span>
                <Link className="link" to={`/equipments`}>Revenir</Link>
            </div>    
        </div>
    )
}

export default UnauthoraizePage
