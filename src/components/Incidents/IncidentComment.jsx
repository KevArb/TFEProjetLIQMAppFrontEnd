// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  } from '@mui/material';

const IncidentComment = () => {
    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    }

    const {id} = useParams();
    const [data, setData] = useState({
        comment: '',
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value 
        });
        console.log(value)
    };

    const resolveIncident = async () => {
        const status = {
            status: 'Résolu'
        }
        await axios.patch(`http://127.0.0.1:8000/api/incident/${id}`, status, { headers }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                window.location.reload(); 
            } 
        }).catch((error) => {
            console.log(error)
        })
    }

    const postComment = async (e) => {
        e.preventDefault();
        const comment = {
            comment: data.comment,
            status: 'Résolution',
        };
        console.log(data)
        await axios.post(`http://127.0.0.1:8000/api/incident/${id}/commentIncident`, comment, { headers }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                resolveIncident();
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div className='modal-form-comment' >
                <form>
                    <input type="text" name='comment' placeholder='Commentaire' value={data.comment} onChange={handleChange} />
                    <button onClick={postComment}>Confirmer</button>
                    <button>Annuler</button>
                </form>
            </div>
        </div>
    )
}

export default IncidentComment
