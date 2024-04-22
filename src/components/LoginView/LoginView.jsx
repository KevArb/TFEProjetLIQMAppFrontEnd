// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LoginView.css'
import Cookies from 'js-cookie';

const LoginView = () => {
    const navigateTo = useNavigate();

    // const [accessToken, setAccessToken] = useState('')
    const [errMsg, setErrMsg] = useState([])
    const [data, setData] = useState({
        login: "",
        password: ""
      });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
    };
     
    //console.log(data)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
          login: data.login,
          password: data.password
        };
        try {
            await axios.post('http://127.0.0.1:8000/api/user/login', userData).then((response) => {
                console.log(response.status, response.data.token);
                // const accessToken = response.data.token;
                // console.log(accessToken)
                try {
                    const token = response.data.token;
                    Cookies.set('token', token, { expires: 1, secure: true });
                  } catch (error) {
                    console.error(error.message);
                  }
                  if (response.status === 200) {
                      return navigateTo('/')
                  }      
              });            
        } catch (error) {
            setErrMsg(error.response.data.message);
            console.log(errMsg)
            return navigateTo('/login', { errMsg })
        }

    };

    return (
        <div className='container-login'>
            <div className="login-card">
                <div className="login-title">
                    <h1>Login</h1>
                </div>
                {/* <div className="separator"></div> */}
                <div className="login-form">
                    <form onSubmit={handleSubmit}>
                        <div className="login-input">
                            <input type="text" placeholder='LOGIN' name='login' value={data.login} onChange={handleChange}/>
                        </div>
                        <div className="separator-form"></div>
                        <div className="password-input">
                            <input type="password" placeholder='PASSWORD' name='password' value={data.password} onChange={handleChange} />
                        </div>
                        <div className="button-login">
                            <button>Login</button>
                        </div>
                        <div className="error-login">
                            {errMsg ? <span className='error-message-login'>{errMsg}</span> : <span></span>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginView


