// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';

const ArchiveButton = ( equipment ) => {

    const token = Cookies.get('token');
    const [btnTxt, setBtnTxt] = useState('');
    const isUsed = equipment.equipment.isUsed;
    const [data, setData] = useState();
    
    
    useEffect(() => {
        if (isUsed) {
            setBtnTxt('Archiver');
            setData(false);
        } else {
            setBtnTxt('Activer');
            setData(true);
        }
    })

    console.log(data)

    const archiveBtnAction = async () => {
        // await axios.patch(`http://127.0.0.1:8000/api/equipment/${equipment.equipment.id}/archiveEquipment`, {
        const updateIsUsed = {
            isUsed : data
        }
        await axios.patch(`http://127.0.0.1:8000/api/equipment/${equipment.equipment.id}`, updateIsUsed, {
            headers: {'Authorization': 'Bearer '+ token}
        }).then(response => {
            if (btnTxt === 'Archiver') {
                setBtnTxt('Activer')
            } else {
                setBtnTxt('Archiver')
            }
            console.log
            if (response.status === 200) {
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error.response.data.message)
        })
    }

    return (
        <div>
            <button onClick={archiveBtnAction}>{btnTxt}</button>
        </div>
    )
}

export default ArchiveButton
