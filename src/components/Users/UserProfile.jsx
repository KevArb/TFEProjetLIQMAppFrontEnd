// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import ChangeUserPwd from './ChangeUserPwd';

const UserProfile = () => {

    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    };
    const [role, setRole] = useState([]);
    const [user, setUser] = useState([]);
    const [changePwdForm, setChangePwdForm] = useState(false);

    const pwdForm = () => (
        setChangePwdForm(!changePwdForm)
    )

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/user/profile`, { headers }).then((response) => {
                
                setUser(response.data.data.user)
                setRole(response.data.role)
                console.log(user)
            }).catch((error) => (
                console.log(error)
            ))
        }
        fetchData();
    }, [])

    return (
        <div>
            <Sidebar userRole={role}/>
            <h1>Bonjour {user.firstName} {user.lastName}</h1>
            <p>Votre rôle : {user.role}</p>
            <p>Email : {user.email}</p>
            {changePwdForm ? <button onClick={pwdForm}>Annuler</button> : <button onClick={pwdForm}>Changer mot de passe</button>}
            {changePwdForm ? <ChangeUserPwd /> : null}
        </div>
    )
}

export default UserProfile
