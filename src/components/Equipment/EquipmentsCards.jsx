// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './css/EquipmentsCards.css'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import { Avatar, Card, CardHeader, TextField, CardContent, CardActions, Typography, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { headers } from '../../utils/functions/constLibrary'

const EquipmentsList = () => { 

    const [items, setItems] = useState([])
    const [role, setRole] = useState([])
    const navigateTo = useNavigate()
    const [services, setServices] = useState([])
    const [suppliers, setSuppliers,] = useState([])
    const [categories, setCategories] = useState([])
    const [filterFields, setFilterFields] = useState({
        supplier: '',
        service: '',
        category: ''
    })

    const equipmentDetails = (itemId) => {
        return navigateTo(`/equipment-details/${itemId}`)
    }

    const handleSearch = (e) => {
        const query = e.target.value
        itemData(query)
    }

    const itemData = async (searchQuery) => {
        await axios.get(`http://127.0.0.1:8000/api/equipment?search=${searchQuery}`, { headers }).then((response) => {
            setRole(response.data.role)
            setItems(response.data)
            if (typeof response.data === 'object') {
                for (const key in response.data) {
                    const value = response.data[key]
                    setItems(value)
                }
            }               
        })
    }

    const handleChangeSelect = (e) => { 
        const value = e.target.value
        setFilterFields({
            ...filterFields,
            [e.target.name]: value
        })  
    }
    
    const fieldsSearch = async () => {
        let url = '?'
        if (filterFields.supplier != '' && filterFields.supplier != 'default') url = url + 'supplier=' + filterFields.supplier + "&"
        if (filterFields.category != '' && filterFields.category != 'default') url = url + 'category=' + filterFields.category + "&"
        if (filterFields.service != '' && filterFields.service != 'default') url = url + 'service=' + filterFields.service + "&"        
        await axios.get(`http://127.0.0.1:8000/api/equipment` + url, { headers }).then((response) => {
            setItems(response.data)
            if (typeof response.data === 'object') {
                for (const key in response.data) {
                    const value = response.data[key]
                    setItems(value)   
                    console.log(value)
                }
            }               
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (filterFields.supplier != '' 
            || filterFields.category != '' 
            || filterFields.service != '' ) {
            fieldsSearch()
        } 
    }, [filterFields])  
    
    useEffect(() => {
        const fetchSupplier = async () => {
            await axios.get('http://127.0.0.1:8000/api/supplier', { headers }).then((response) => {
                setSuppliers(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchServices = async () => {
            await axios.get('http://127.0.0.1:8000/api/service', { headers }).then((response) => {
                setServices(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchCat = async () => {
            await axios.get('http://127.0.0.1:8000/api/equipmentCat', { headers }).then((response) => {
                setCategories(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipment`, { headers }).then((response) => {
                setRole(response.data.role)
                setItems(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data[key]
                        setItems(value)   
                    }
                }               
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchSupplier()
        fetchCat()
        fetchServices()
        fetchData()
    }, [])

    return (
        <div className='container'> 
            <Sidebar userRole={role}/>
            <div className='main-container'> 
                <div className='search-bar-container'>
                    <div>
                        <TextField id='search-field' type="text" placeholder='Rechercher un équipement...' onChange={handleSearch} />
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id='select-card'>Service</InputLabel>
                            <Select onChange={handleChangeSelect} 
                                    name='service' 
                                    id='select-card' 
                                    label='Service' defaultValue='default'>
                                <MenuItem value='default'><em>None</em></MenuItem> 
                                {services?.map((service) => {
                                    return (
                                        <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>                         
                                    )     
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id='select-card'>Fournisseur</InputLabel>
                            <Select onChange={handleChangeSelect} 
                                    value={filterFields.supplier} 
                                    name='supplier' 
                                    id='select-card' 
                                    label='Fournisseur' defaultValue='default'>
                                <MenuItem value='default'><em>None</em></MenuItem> 
                                {suppliers?.map((supplier) => {
                                    return (
                                        <MenuItem key={supplier.id} value={supplier.id}>{supplier.nameCompagny}</MenuItem>                            
                                    )     
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id='select-card'>Catégorie</InputLabel>
                            <Select onChange={handleChangeSelect} 
                                    value={filterFields.category} 
                                    name='category' 
                                    id='select-card' 
                                    label='Catégorie' defaultValue='default'>
                                <MenuItem value='default'><em>None</em></MenuItem> 
                                {categories?.map((cat) => {
                                    return (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>                              
                                    )     
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="card-container">  
                    {items.map((item) => {
                        return(
                            <Card sx={{ maxWidth: 345 }} onClick={() => equipmentDetails(item.id)} className="equipment-card" key={item.id}>
                                <CardHeader className="card-title"
                                    avatar ={ <Avatar>{item.code.charAt(0).toUpperCase()}</Avatar> }/>
                                <CardContent className="equipment-detail-card">
                                    <h1>{item.name}</h1>
                                    <div>
                                        <Typography>{item.code}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2">{item.serialNumber}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2">{item.description}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2">{item.supplier.nameCompagny}</Typography>
                                    </div>  
                                </CardContent>
                                <CardActions>
                                    <Chip label={item.category.name} />
                                    <Chip label={item.service.name} />
                                </CardActions>
                            </Card>                          
                        )
                    })}
                </div>
            </div> 
        </div>
    )
}

export default EquipmentsList
