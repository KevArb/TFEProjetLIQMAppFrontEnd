// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChangeUserPwd = () => {

    const token = Cookies.get('token');
    const headers = {
        'Authorization': 'Bearer '+ token
    };
    const [data, setData] = useState({
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
        console.log(value)
    };

    const handleChangePwd = async () => {
        if (data.newPassword1 === data.newPassword2) {
            const userData = {
                password: data.oldPassword,
                passwordConfirm: data.newPassword1,
            };

            await axios.patch(`http://127.0.0.1:8000/api/user/updatePassword`, userData, { headers }).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return (
        <div>
            <form>
                <input type="password" name="oldPassword" value={data.oldPassword} placeholder='Ancien mot de passe' onChange={handleChange}/>
                <input type="password" name="newPassword1" value={data.newPassword1} placeholder='Nouveau mot de passe' onChange={handleChange}/>
                <input type="password" name="newPassword2" value={data.newPassword2} placeholder='Nouveau mot de passe' onChange={handleChange}/>
                <button onClick={handleChangePwd}>Confirmer</button>
            </form>
        </div>
    )
}

export default ChangeUserPwd
