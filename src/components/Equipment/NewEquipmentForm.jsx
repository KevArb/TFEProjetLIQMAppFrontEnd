// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NewServiceForm from './NewServiceForm'
import NewSupplierForm from './NewSupplierForm'
import NewCategoryForm from './NewCategoryForm'
import Cookies from 'js-cookie'
import Sidebar from '../Sidebar/Sidebar'
import './css/NewEquipment.css'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'


const NewEquipmentForm = () => {

    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState([])
    const [services, setServices] = useState([])
    const [addServcie, setAddService] = useState(false)
    const [addSupplier, setAddSupplier] = useState(false)
    const [addCat, setAddCat] = useState(false)
    const [role, setRole] = useState([])
    const token = Cookies.get('token')
    const [errMsgName, setErrMsgName] = useState('')
    const [errMsgCode, setErrMsgCode] = useState('')
    const [errMsgSN, setErrMsgSN] = useState('')
    const [errMsgSupplier, setErrMsgSupplier] = useState('')
    const [errMsgService, setErrMsgService] = useState('')
    const [errMsgCat, setErrMsgCat] = useState('')

    const [image, setImage] = useState()

    const addServiceForm = () => {
        setAddService(!addServcie)
        setAddSupplier(false)
        setAddCat(false)
    }

    const addSupplierForm = () => {
        setAddSupplier(!addSupplier)
        setAddCat(false)
        setAddService(false)
    }

    const addCatForm = () => {
        setAddCat(!addCat)
        setAddSupplier(false)
        setAddService(false)
    }

    const [data, setData] = useState({
        name: '',
        code: '',
        sn: '',
        description: '',
        supplier: '',
        service: '',
        category: '',
    })

    const handleUploadImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleChange = (e) => {
        const value = e.target.value
        setData({
          ...data,
          [e.target.name]: value
        })
        console.log(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault() 
        setErrMsgName('')
        setErrMsgCode('')
        setErrMsgSN('')
        setErrMsgSupplier('')
        setErrMsgService('')
        setErrMsgCat('')
        const equipmentData = {
            name: data.name,
            code: data.code,
            serialNumber: data.sn,
            description: data.description,
            supplier: data.supplier,
            service: data.service,
            category: data.category,
        }
        
        try {
            await axios.post('http://127.0.0.1:8000/api/equipment/newEquipment', equipmentData, { headers: {'Authorization': 'Bearer '+ token} }).then((response) => {
                console.log(response)
            })             
        } catch (error) {
            if (data.name === '') setErrMsgName("Veuillez renseigner un nom d'équipement")
            if (data.code === '') setErrMsgCode("Veuillez renseigner un code")
            if (data.sn === '') setErrMsgSN("Veuillez renseigner un numéro de série")
            if (data.supplier === '' || data.supplier == 'none') setErrMsgSupplier("Veuillez renseigner un fournisseur")
            if (data.service === '' || data.service === 'none') setErrMsgService("Veuillez renseigner un service")
            if (data.category === '' || data.category === 'none') setErrMsgCat("Veuillez renseigner une catégorie d'équipement")
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get('http://127.0.0.1:8000/api/supplier', {
                    headers: {'Authorization': 'Bearer '+ token}
                }).then((response) => {
                    setRole(response.data.role)
                    if (typeof response.data === 'object') {
                        for (const key in response.data) {
                            const value = response.data[key]
                            setSuppliers(value)
                        }
                    }  
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get('http://127.0.0.1:8000/api/service', {
                    headers: {'Authorization': 'Bearer '+ token}
                }).then((response) => {
                    if (typeof response.data === 'object') {
                        for (const key in response.data) {
                            const value = response.data[key]
                            setServices(value)
                        }
                    } 
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = () => {
            try {
                axios.get('http://127.0.0.1:8000/api/equipmentCat', {
                    headers: {'Authorization': 'Bearer '+ token}
                }).then((response) => {
                    if (typeof response.data === 'object') {
                        for (const key in response.data) {
                            const value = response.data[key]
                            setCategories(value)
                        }
                    } 
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className='container-new-equipment'>
            <Sidebar userRole={role}/>
            <div className="form-equipment">
                <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                    <div>
                        <div>
                            <TextField type="text" placeholder='Name' name='name' value={data.name} onChange={handleChange} />
                            {errMsgName ? <span className='err-msg'>{errMsgName}</span> : null}
                        </div>
                        <div>
                            <TextField type="text" placeholder='Code' name='code' value={data.code} onChange={handleChange} />
                            {errMsgCode ? <span className='err-msg'>{errMsgCode}</span> : null}
                        </div>
                        <div>
                            <TextField type="text" placeholder='serial number' name='sn' value={data.sn} onChange={handleChange} />
                            {errMsgSN ? <span className='err-msg'>{errMsgSN}</span> : null}
                        </div>
                    </div>
                    <div className='desciption-field'>
                        <TextField type="text" placeholder='description' name='description' value={data.description} onChange={handleChange} multiline rows={6} />
                    </div>
                    <div className="upload-img">
                        <TextField type="file" name='image' onChange={handleUploadImage}/>
                    </div>
                    <div className='select'>
                        <div className='supplier-form'>
                            <div className='select-supplier'>
                                <FormControl fullWidth>
                                    <InputLabel>Fournisseur</InputLabel>
                                    <Select className='select-field' name='supplier' label="fournisseur" value={data.supplier} onChange={handleChange}>
                                        {suppliers.map((supplier) => {
                                                return(
                                                    <MenuItem className='select-value' key={supplier.id} value={supplier.id}>{supplier.nameCompagny}</MenuItem> 
                                                )                   
                                            })}
                                    </Select>
                                </FormControl>
                                <Button onClick={addSupplierForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Fournisseur</Button>
                            </div>    
                        </div>
                        <div>
                            <div className='service-form'>
                                <div className='select-service'>
                                    <FormControl fullWidth>
                                        <InputLabel>Service</InputLabel>
                                        <Select className='select-field' name='service' value={data.service} onChange={handleChange}>
                                            {services.map((service) => {
                                                return(
                                                    <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem> 
                                                )                   
                                            })}
                                        </Select>
                                    </FormControl>
                                    <Button onClick={addServiceForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Service</Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="category-form">
                                <div className='select-category'>
                                    <FormControl fullWidth>
                                            <InputLabel>Catégorie</InputLabel>
                                            <Select className='select-field' name='category' value={data.category}  onChange={handleChange}>
                                                {categories.map((category) => {
                                                    return(
                                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem> 
                                                    )                   
                                                })}
                                            </Select>
                                    </FormControl>
                                    <Button onClick={addCatForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Catégorie</Button>
                                </div>
                            </div>
                        </div>
                        {errMsgSupplier ? <span className='err-msg'>{errMsgSupplier}</span> : null}
                        {errMsgService ? <span className='err-msg'>{errMsgService}</span> : null}
                        {errMsgCat ? <span className='err-msg'>{errMsgCat}</span> : null}

                    </div>
                    {/* <div className='select'>
                        <Button onClick={addServiceForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Service</Button>
                        <Button onClick={addSupplierForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Fournisseur</Button>
                        <Button onClick={addCatForm} startIcon={<FontAwesomeIcon icon={faCirclePlus} size='2x'/>}>Catégorie</Button>
                    </div> */}
                    <div className="action">
                        <Button onClick={handleSubmit} size="large">Confirmer</Button>
                    </div>
                </form>
            </div>

            <div className='modal' >
                <div className='overlay'>
                    { addServcie ? 
                    <div>
                        <NewServiceForm />
                    </div>  : <div></div>                       
                    } 
                </div>
                <div>
                    { addSupplier ? 
                    <div>
                        <NewSupplierForm />
                    </div>  : <div></div>                       
                    } 
                </div>
                <div>
                    { addCat ? 
                    <div>
                        <NewCategoryForm />
                    </div>  : <div></div>                       
                    } 
                </div>
            </div>
        </div>
    )
}

export default NewEquipmentForm
