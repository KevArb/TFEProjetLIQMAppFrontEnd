// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './css/EquipmentsCards.css'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import {    Avatar, Card, CardHeader, TextField, CardContent, CardActions, Typography, 
            Table, Chip, TableHead, Select, MenuItem, FormControl, 
            InputLabel, Button, TableContainer, TableRow, TableCell, TableBody, 
            Checkbox } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faTableCellsLarge, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'

const EquipmentsList = () => { 
    
    const token = Cookies.get('token')
    const headers = {
        'Authorization': 'Bearer '+ token
    }
    const role = Cookies.get('userRole')
    const [items, setItems] = useState([])
    const navigateTo = useNavigate()
    const [services, setServices] = useState([])
    const [suppliers, setSuppliers,] = useState([])
    const [categories, setCategories] = useState([])
    const [listView, setListView] = useState(false)
    const [isNotUsed, setIsNotUsed] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [search, setSearch] = useState('')
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
        setSearch(query)
        itemData(query)
    }

    const handleChangeSelect = (e) => { 
        const value = e.target.value
        setFilterFields({
            ...filterFields,
            [e.target.name]: value
        })     
    }

    const handlelistView = () => {
        setListView(!listView)
    }

    const resetPage = () => {
        window.location.reload()
    }

    // const showIsNotUsed = () => {
    //     setIsNotUsed(!isNotUsed)
    //     console.log(search)
    //     itemData(search)
    // }

    const itemData = async (searchQuery) => {
        let url = '?'
        if (filterFields.supplier != '' && filterFields.supplier != 'default') url = url + 'supplier=' + filterFields.supplier + "&"
        if (filterFields.category != '' && filterFields.category != 'default') url = url + 'category=' + filterFields.category + "&"
        if (filterFields.service != '' && filterFields.service != 'default') url = url + 'service=' + filterFields.service + "&"

        // init when empty field
        if (url === '?' && !searchQuery) {
            console.log('quand init champ vide')
            let urlAPI = `http://127.0.0.1:8000/api/equipment?isUsed=true&search=${searchQuery}`
            if (isNotUsed) {
                urlAPI = `http://127.0.0.1:8000/api/equipment?search=${searchQuery}`
            } 
            await axios.get(urlAPI, { headers }).then((response) => {
                setItems(response.data)
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data[key]
                        setItems(value)
                    }
                }               
            })
        } else {
            if (searchQuery === '') {
                let urlAPI = `http://127.0.0.1:8000/api/equipment?isUsed=true`
                if (!isNotUsed) {
                    urlAPI = `http://127.0.0.1:8000/api/equipment`
                } 
                url = url.replace('?', '')
                await axios.get(urlAPI + url, { headers }).then((response) => {
                    setItems(response.data)
                    if (typeof response.data === 'object') {
                        for (const key in response.data) {
                            const value = response.data[key]
                            setItems(value)
                        }
                    }               
                })
            } else {
                url = url.replace('?', '')
                let urlAPI = `http://127.0.0.1:8000/api/equipment?isUsed=true&search=${searchQuery}`
                if (isNotUsed) {
                    urlAPI = `http://127.0.0.1:8000/api/equipment?search=${searchQuery}`
                } 
                await axios.get(urlAPI + `&` + url, { headers }).then((response) => {
                    setItems(response.data)
                    if (typeof response.data === 'object') {
                        for (const key in response.data) {
                            const value = response.data[key]
                            setItems(value)
                        }
                    }               
                })
            }
        }
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
                }
            }               
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (filterFields.supplier != '' 
            || filterFields.category != '' 
            || filterFields.service != '') {
            fieldsSearch()
        } 
    }, [filterFields])  
    
    useEffect(() => {
        const fetchSupplier = async () => {
            await axios.get(`http://127.0.0.1:8000/api/supplier?isUsed=true`, { headers }).then((response) => {
                setSuppliers(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchServices = async () => {
            await axios.get(`http://127.0.0.1:8000/api/service?isUsed=true`, { headers }).then((response) => {
                setServices(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchCat = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipmentCat?isUsed=true`, { headers }).then((response) => {
                setCategories(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        const fetchData = async () => {
            let urlAPI = `http://127.0.0.1:8000/api/equipment`
            if (!isNotUsed) {
                urlAPI = `http://127.0.0.1:8000/api/equipment?isUsed=true`
            } 
            await axios.get(urlAPI, { headers }).then((response) => {
                setItems(response.data)
                setIsNotUsed(isNotUsed)
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

    }, [role, isNotUsed])
    
    return (
        <div className='container'> 
            <div>
                <Sidebar/>   
            </div>
            <div className='main-container'> 
                <div className='search-bar-container'>
                    <div>
                        <TextField id='search-field' type="text" placeholder='Rechercher un équipement...' onChange={handleSearch} />
                        { role === 'admin' || role === 'manager' ? 
                            <div>
                                {/* <label>Afficher archives</label> */}
                                {/* <FormControlLabel control={ <Checkbox onClick={showIsNotUsed} name='isUsed' checked={isNotUsed}/> } /> */}
                            </div> : null}
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
                    <div className='action-filter'>
                        <div>
                            <Button onClick={resetPage}>Reset</Button>
                        </div>
                        {!listView ? 
                            <div> 
                                <FontAwesomeIcon id="btn-list" onClick={handlelistView} icon={faList} size='2x'/>
                            </div> : 
                            <div>
                                <FontAwesomeIcon id="btn-list" onClick={handlelistView} icon={faTableCellsLarge} size='2x'/>
                            </div>}    
                    </div>
                </div>
                <div className="card-container">  
                {/*  Equipments cards display */} 
                {!listView ? <div className="card-container">
                    {items?.map((item) => {
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
                                    <div>
                                        {!item.isUsed ? <div> <FontAwesomeIcon icon={faBoxArchive} /></div> : <div></div>}
                                    </div> 
                                </CardContent>
                                <CardActions>
                                    <Chip label={item.category.name} />
                                    <Chip label={item.service.name} />
                                </CardActions>
                            </Card>                          
                        )
                    })}
                    </div> : 
                    <div className="list-container">
                        {/* Equipment List Display  */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={3}>Equipement</TableCell>
                                        <TableCell colSpan={1}>Code</TableCell>
                                        <TableCell colSpan={1}>SN</TableCell>
                                        <TableCell colSpan={1}>Service</TableCell>
                                        <TableCell colSpan={1}>Catégorie</TableCell>
                                        <TableCell colSpan={1}>Fournisseur</TableCell>
                                        <TableCell colSpan={1}>isUsed</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>      
                                    {items?.map((item) => {
                                        return(
                                            <TableRow className="equipment-detail-list" key={item.id} onClick={() => equipmentDetails(item.id)}>
                                                <TableCell colSpan={3}>{item.name}</TableCell>
                                                <TableCell colSpan={1}>{item.code}</TableCell>
                                                <TableCell colSpan={1}>{item.serialNumber}</TableCell>
                                                <TableCell colSpan={1}>{item.service.name}</TableCell>
                                                <TableCell colSpan={1}>{item.category.name}</TableCell>
                                                <TableCell colSpan={1}>{item.supplier.nameCompagny}</TableCell>
                                                <TableCell colSpan={1}><Checkbox checked={item.isUsed} disabled/></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>}
                </div>   
            </div>
        </div>
    )
}

export default EquipmentsList
