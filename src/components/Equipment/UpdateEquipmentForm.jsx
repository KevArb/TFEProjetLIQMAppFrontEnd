// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import { formatErrMsg } from '../../utils/functions/Library';
import './css/UpdateEquipment.css';


const UpdateEquipmentForm = () => {
    
    const token = Cookies.get('token');
    const {id} = useParams();
    const [equipment, setEquipment] = useState([])
    const navigateTo = useNavigate();
    const [errMsg, setErrMsg] = useState([])

    const [data, setData] = useState({
        name: equipment.name,
        code: equipment.code,
        serialNumber: equipment.serialNumber,
        description: equipment.description,
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value === '' ? null : value 
        });
        console.log(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const equipmentData = {
            name: data.name, 
            code: data.code,
            serialNumber: data.serialNumber,
            description: data.description
        };
        try {
            await axios.patch(`http://127.0.0.1:8000/api/equipment/${id}`, equipmentData, {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                console.log(response)
                if (response.status === 200) {
                    return navigateTo(`/equipment-details/${id}`)
                }
            }).catch((error) => {
                setErrMsg(formatErrMsg(error.response.data.message))
                console.log(errMsg)
                return { errMsg }                
            });            
        } catch (error) {
            setErrMsg(error.response.data.message);
        }

    };

    useEffect(() => {
        const fetchData = async () => { 
            await axios.get(`http://127.0.0.1:8000/api/equipment/${id}`, {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                setEquipment(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data.data[key]
                        setEquipment(value)         
                    }
                } 
            }).catch ((error) => {
                console.log(error.response.data.message)
            })
        }
        fetchData();
    }, [])

    return (
        <div>
            <div className="container-update">
                <Sidebar />
                <div className="form-update">
                    <form action="">
                        <input type="text" value={data.name || equipment.name || ''} placeholder={equipment.name || ''} name='name' onChange={handleChange}/>
                        <input type="text" value={data.code || equipment.code || ''} placeholder={equipment.code || ''}  name='code' onChange={handleChange}/>
                        <input type="text" value={data.serialNumber || equipment.serialNumber || ''} placeholder={equipment.serialNumber || ''} name='serialNumber' onChange={handleChange}/>
                        <input type="text" value={data.description || equipment.description || ''} placeholder={equipment.description || ''}  name='description' onChange={handleChange}/>
                        <button onClick={handleSubmit}>Submit</button>
                        { errMsg ? <div>{errMsg}</div> : <div></div>}
                    </form>
                </div>

            </div>

        </div>
    )
}

export default UpdateEquipmentForm
