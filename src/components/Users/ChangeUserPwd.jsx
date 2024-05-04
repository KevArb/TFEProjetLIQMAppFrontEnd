// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TextField,FormControl, Button, Dialog, DialogActions} from '@mui/material'
import { headers } from '../../utils/functions/constLibrary'

const ChangeUserPwd = () => {

    const [open, setOpen] = useState(true)
    const [data, setData] = useState({
        oldPassword: '',
        password: '',
        passwordConfirm: ''
    })

    const [errMsgs, setErrMsgs] = useState([])

    const closeModalForm = () => {
        setOpen(!open)
        window.location.reload()
    }

    const handleChange = (e) => {
        const value = e.target.value
        setData({
          ...data,
          [e.target.name]: value
        })
    }

    const correctPassword = async (data) => {
        await axios.post(`http://127.0.0.1:8000/api/user/updatePassword`, data, { headers }).then((response) => {
            console.log(response)
        }).catch((error) => {
            setErrMsgs(error.response.data.message.split("/"))
        })
    }

    const updatePwd = async (data) => {
        await axios.patch(`http://127.0.0.1:8000/api/user/updatePassword2`, data, { headers }).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleChangePwd = async () => {
        const reqData = {
            oldPassword: data.oldPassword,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        }
        correctPassword(reqData)
        updatePwd(reqData)   
    }

    return (
        <div>
            <FormControl fullWidth>
                <Dialog open={open}>
                    <TextField type="password" name="oldPassword" value={data.oldPassword} placeholder='Ancien mot de passe' onChange={handleChange}/>
                    {errMsgs[0] ? <span>{errMsgs[0]}</span> : null}
                    <TextField type="password" name="password" value={data.newPassword1} placeholder='Nouveau mot de passe' onChange={handleChange}/>
                    <TextField type="password" name="passwordConfirm" value={data.newPassword2} placeholder='Nouveau mot de passe' onChange={handleChange}/>
                    {errMsgs[1] ? <span>{errMsgs[1]}</span> : null}
                    <Button onClick={handleChangePwd}>Confirmer</Button>
                    <DialogActions>
                        <Button onClick={closeModalForm}>Annuler</Button>
                    </DialogActions>
                </Dialog>
            </FormControl>
        </div>
    )
}

export default ChangeUserPwd
