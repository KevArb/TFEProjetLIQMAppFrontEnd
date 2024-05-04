// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../Sidebar/Sidebar'
import ChangeUserPwd from './ChangeUserPwd'
import './css/UserProfile.css'
import { Button, Avatar } from '@mui/material'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { headers } from '../../utils/functions/constLibrary'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const UserProfile = () => {

    const [user, setUser] = useState([])
    const [changePwdForm, setChangePwdForm] = useState(false)
    const [avatarForm, setAvatarForm] = useState(false)
    const [image, setImage] = useState()
    const [avatar, setAvatar] = useState()

    const submitImg = (id) => {
        // e.preventDefault()
        const formData = new FormData()
        formData.append("image", image)
        formData.append("id", id)
        const fetchData = async () => {
            await axios.post(`http://127.0.0.1:8000/api/user/upload-image`, formData, { headers }).then((response) => {
                console.log(response)
            }).catch((error) => (
                console.log(error)
            ))
        }
        fetchData()
    }

    const pwdForm = () => (
        setChangePwdForm(!changePwdForm)
    )

    const newAvatarUpload = () => {
        setAvatarForm(!avatarForm)
    }

    const uploadImg = (e) => {
        setImage(e.target.files[0])
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/user/profile`, { headers }).then((response) => {
                setUser(response.data.data.user)
                console.log(response.data.data.user)
            }).catch((error) => (
                console.log(error)
            ))
        }
        const getImg = async () => {
            await axios.get(`http://127.0.0.1:8000/api/user/get-img-profil`, { headers }).then((response) => {
                setAvatar(response.data.data)
            }).catch((error) => (
                console.log(error)
            ))
        }
        fetchData()
        getImg()
    }, [])

    return (
        <div className='container-user-view'>
            <Sidebar userRole={user.role}/>
            <div className='container-user'>
                <div>
                    <h1>Bonjour {user.firstName} {user.lastName}</h1>
                </div>
                <div className='avatar-section'>
                    {avatarForm ? 
                    <div className='upload-avatar'>
                        <input type="file" id="actual-btn" hidden onChange={uploadImg}/>
                        <label id='label-upload' htmlFor="actual-btn">Choisir fichier</label>
                        <Button onClick={() => submitImg(user._id)}>Confirmer</Button>
                        <Button onClick={newAvatarUpload}>Annuler</Button>
                    </div> : 
                    <div>
                        <Button onClick={newAvatarUpload}>
                                <Avatar alt="" src={`../../../../../../TFE/Developpement/upload/'${avatar}`} />
                                <FontAwesomeIcon icon={faPenToSquare} />
                        </Button> 
                    </div>} 
                </div>

                <div>
                    <p>login : {user.login}</p>
                    <p>Rôle : {user.role}</p>
                    <p>Email : {user.email}</p>
                </div>
                <div>
                    <Button onClick={pwdForm}>Changer de mot de passe</Button>
                    {changePwdForm ? <ChangeUserPwd /> : null} 
                </div>
            </div>
        </div>
    )
}

export default UserProfile
