// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './css/EquipmentsCards.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Sidebar from '../Sidebar/Sidebar'
import { Avatar, Card, CardHeader, TextField, CardContent, CardActions, Typography, Chip } from '@mui/material'

const EquipmentsList = () => { 

    const token = Cookies.get('token');
    const [items, setItems] = useState([]);
    const [role, setRole] = useState([]);
    const navigateTo = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const equipmentDetails = (itemId) => {
        return navigateTo(`/equipment-details/${itemId}`)
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredResults = searchResults.filter((result) =>
          result.name.includes(query)
        );
        setSearchResults(filteredResults);
    }
    
    useEffect(() => {
        try {
            axios.get("http://127.0.0.1:8000/api/equipment", {
                headers: {'Authorization': 'Bearer '+ token}
            }).then((response) => {
                console.log(response)
                setRole(response.data.role)
                setItems(response.data);
                if (typeof response.data === 'object') {
                    for (const key in response.data) {
                        const value = response.data[key]
                        setItems(value)
                        
                    }
                }  
                
            }).catch(function () {
                // console.log(error.response.status)
                // console.log(error.response.data.message)
                if (!token) {
                    return navigateTo('/401')
                }            
            })
        } catch (error) {
           console.log(error.response.data.message) 
        }
    }, [])

    return (
        <div className='container'> 
            <Sidebar userRole={role}/>
            <div className='main-container'> 
                <div className='search-bar-container'>
                    <TextField id='search-field' type="text" placeholder='Search...' onChange={handleSearch}/>
                </div>
                <div className="card-container">  
                    {items.map((item) => {
                        return(
                            <Card sx={{ maxWidth: 345 }} onClick={() => equipmentDetails(item.id)} className="equipment-card" key={item.id}>
                                <CardHeader className="card-title"
                                    avatar ={
                                        <Avatar>{item.code.charAt(0).toUpperCase()}</Avatar>
                                    }  
                                />
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
