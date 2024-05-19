// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { TableBody, TableContainer, TableHead, Table, TableCell, TableRow, Dialog, 
        DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Button, FormControl } from '@mui/material'
import Cookies from 'js-cookie'
import axios from 'axios'
import './css/ListUser.css'
import { formatErrMsg } from '../../utils/functions/Library'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import UpdateRoleForm from './UpdateRoleForm'
import { useNavigate } from 'react-router-dom';

const UserList = () => {

    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const navigateTo = useNavigate()
    const [users, setUsers] = useState([])
    const [addUser, setAddUser] = useState(false)
    const [userSelectId, setUSerSelecteId] = useState('')
    const [data, setData] = useState({
        role: '',
        lastName: '',
        firstName: '',
        email: '',
        login: '',
        password: '',
        passwordConfirm: ''
    })

    const [updateUserForm, setUpdateUserForm] = useState(false)

    const [errMsg, setErrMsg] = useState([])
    const [errMsgLogin, setErrMsgLogin] = useState('')

    const handleChangeNewUserForm = (e) => {
        const value = e.target.value
        setData({
            ...data,
            [e.target.name]: value
        })   
    }

    const addUserForm = () => {
        setAddUser(!addUser)
    }

    const updateUserModalForm = (id) => {
        setUpdateUserForm(!updateUserForm)
        setUSerSelecteId(id)
    }

    const handleClose = () => {
        setAddUser(!addUser)
    }

    const handleSubmitNewUser = () => {
        const dataUser = {
            role: data.role,
            lastName: data.lastName,
            firstName: data.firstName,
            email: data.email,
            login: data.login,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        }

        const addNewUser = async () => {
            await axios.post(`http://127.0.0.1:8000/api/user/newUser`, dataUser, { headers }).then((response) => {
                console.log(response)
            }).catch((error) => {
                setErrMsg(formatErrMsg(error.response.data.message))
                console.log(error)
                if (error.response.data.message === 'Ce login existe déjà !!!') {
                    setErrMsgLogin(error.response.data.message)   
                }
            })
        }

        addNewUser()
    }

    useEffect(() => {
        const getAllUsers = async () => {
            await axios.get(`http://127.0.0.1:8000/api/user/`, { headers }).then((response) => {
                setUsers(response.data.data)
            }).catch((error) => {
                if (error.response.status === 403) {
                    return navigateTo('/403')
                }
            })
        }

        getAllUsers()
    }, [])
    
    return (
        <div className='container-list-user'>
            <div>
                <Sidebar />
            </div>
            <div className='list-user'>
                <div>
                    <FontAwesomeIcon className='add-user-btn' onClick={addUserForm} icon={faUserPlus} size='2x'/>
                </div>

                {addUser ? 
                <div>
                <Dialog open={addUser}>
                    <DialogTitle>Ajouter nouvel utilisateur</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <Select name='role' onChange={handleChangeNewUserForm} defaultValue='default'>
                                <MenuItem value='default'>-- Rôle --</MenuItem>
                                <MenuItem value='manager'>Qualiticien</MenuItem>
                                <MenuItem value="user">Technologue</MenuItem>
                            </Select>   
                            <TextField type="text" value={data.lastName} onChange={handleChangeNewUserForm} name='lastName' placeholder='Nom'/>
                            <TextField type="text" value={data.firstName} onChange={handleChangeNewUserForm} name='firstName' placeholder='Prénom'/>
                            <TextField type="text" value={data.email} onChange={handleChangeNewUserForm} name='email' placeholder='email'/> 
                            <TextField type="text" value={data.login} onChange={handleChangeNewUserForm} name='login' placeholder='login'/>
                            <TextField type="password" value={data.password} onChange={handleChangeNewUserForm} name='password' placeholder='mot de passe'/>
                            <TextField type="password" value={data.passwordConfirm} onChange={handleChangeNewUserForm} name='passwordConfirm' placeholder='Confirmer mot de passe'/>                   
                            <Button onClick={handleSubmitNewUser}>Confirmer</Button> 
                        </FormControl>
                    </DialogContent>
                    <div className='err-msg'>
                        {  <div>
                                {errMsg?.map((element, index) => {
                                    return (
                                        <span key={index}>{element} <br></br></span>
                                    )
                                })}
                                <span>{errMsgLogin} </span>
                            </div> }
                    </div>   
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                </DialogActions>
                </Dialog>
                </div> : null}

                <div>
                    { updateUserForm ? 
                        <div>
                            <UpdateRoleForm userId={userSelectId} />
                        </div> : null}
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom </TableCell>
                                <TableCell>Prénom</TableCell>
                                <TableCell>Login</TableCell>
                                <TableCell>Rôle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((user) => {
                                return(
                                    <TableRow className='user-row' onClick={() => updateUserModalForm(user._id)} key={user._id}>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.login}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            
        </div>
    )
}

export default UserList
