// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LoginView.css'
import { AuthContext } from './AuthProvider';

const LoginView = () => {

    const { login } = useContext(AuthContext);
    const navigateTo = useNavigate()
    const [errMsg, setErrMsg] = useState([])
    const [data, setData] = useState({
        login: "",
        password: ""
      })
    
    const handleChange = (e) => {
        const value = e.target.value
        setData({
          ...data,
          [e.target.name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
          login: data.login,
          password: data.password
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/user/login', userData).then((response) => {
                console.log(response.data.token)
                if (response.status === 200) {
                    login(response.data.token);
                    return navigateTo('/equipments')
                } else {
                    alert(data.error);
                }
            })
        } catch (error) {
            setErrMsg(error.response.data.message)
        }
    };
     
    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const userData = {
    //       login: data.login,
    //       password: data.password
    //     }
    //     try {
    //         await axios.post('http://127.0.0.1:8000/api/user/login', userData).then((response) => {
    //             try {
    //                 const token = response.data.token
    //                 Cookies.set('token', token, { expires: 1, secure: true })
    //                 } catch (error) {
    //                     console.error(error.message)
    //                 }
    //                 if (response.status === 200) { 
    //                     return navigateTo('/')
    //                 }      
    //           })            
    //     } catch (error) {
    //         setErrMsg(error.response.data.message)
    //         console.log(errMsg)
    //         return navigateTo('/login', { errMsg })
    //     }

    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const userData = {
    //       login: data.login,
    //       password: data.password
    //     }
    //     await axios.post('http://127.0.0.1:8000/api/user/login', userData).then((response) => {
    //             const token = response.data.token
    //             Cookies.set('token', token, { expires: 1, secure: true })
    //             // setAuth({ token, isAuthenticated: true })
    //             if (response.status === 200) { 
    //                 return navigateTo('/')
    //             }      
    //         }).catch((error) => {
    //             setErrMsg(error.response.data.message)
    //             console.log(errMsg)
    //             return navigateTo('/login', { errMsg })
    //         })
    // }

    return (
        <div className='container-login'>
            <div className="login-card">
                <div className="login-title">
                    <h1>Login</h1>
                </div>
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


