// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField, FormControlLabel } from '@mui/material'
import './css/ModalMaintenanceUpdate.css'
import { headers} from '../../utils/functions/constLibrary'
import axios from 'axios'

const ModalFormMaintenanceUpdate = ( props ) => {

    const [open, setOpen] = useState(true)
    const [maintenance, setMaintenance] = useState({})
    const [equipments, setEquipments] = useState([])
    const [data, setData] = useState({

    })

    const quitForm = () => {
        setOpen(!open)
        window.location.reload()
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/maintenance/getMaintenance/${props.idMaintenance}`, { headers }).then((response) => {
                console.log(response.data.data)
                setMaintenance(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://127.0.0.1:8000/api/equipment/`, { headers }).then((response) => {
                console.log(response.data.data)
                setEquipments(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        }
        fetchData()
    }, [])

    console.log(equipments)

    return (
        <div>
            <Dialog open={open} fullWidth>
                <FormControl fullWidth>
                    <div className='form-update'>
                    {/* <DialogTitle>Modifier maintenance</DialogTitle> */}
                    <DialogContent className='form-update-maintenance' >
                        <TextField type='text' value={maintenance.name} label="Titre" />
                        <TextField type='text' value={maintenance.code} placeholder='Code' label="Code"/>
                        {/* <p>{maintenance.equipment.name}</p> */}
                        <Select label="Equipement"> 
                            {equipments?.map((equipment) => {
                                return (
                                    <div key={equipment.id}>
                                        <MenuItem>{equipment.name}</MenuItem>
                                    </div>                                   
                            ) 
                            })}  
                        </Select>
                        {maintenance.steps?.map((step) => {
                            return(
                                <div key={step.id} className='step-view-update'>        
                                    <div>
                                        <TextField id='num-step' type='text' value={step.number} label='N°'/>
                                    </div>    
                                    <div >
                                        <TextField id='title-step' type='text' value={step.title}  label='Titre'/>
                                    </div>  
                                    <div>
                                        <TextField  id='description-step' type='text' value={step.description}  label='Description' multiline rows={6}/>
                                    </div>                                                         
                                </div>
                            )
                        })}

                        <FormControlLabel control={ <Checkbox name='isUsed' value={maintenance.isUsed}/> } label="isUsed" />
                    </DialogContent>
                    <DialogActions>
                        <Button>Confirmer</Button>
                    </DialogActions> 
                    </div>       
                </FormControl>
                <Button onClick={quitForm}>Annuler</Button>
            </Dialog>
        </div>
    )
}

export default ModalFormMaintenanceUpdate
