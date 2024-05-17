
export const isLoggedIn = (token) => {
    if (token === undefined) {
        return false
    } else {
        return true
    }
}


export const convertTypeData = (data) => {
    if (typeof data === 'object') {
        for (const key in data.data) {           
            const value = data[key]
            console.log(value)
            return value
        }
    } 
}

export function formatErrMsg(msg) {
    let txt = msg;
    let array = [];
    let newArray = [];
    txt = txt.replaceAll(":", "/");
    txt = txt.replaceAll(",", "/");
    array = txt.split("/");
    array.shift();
    for (let i = 1; i < array.length; i+=2) {
        newArray.push(array[i])
    }
    return newArray
}

export function formatDateTime( date ) {
    const dateObj = new Date(date);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit', 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    
    const formattedDate = dateObj.toLocaleString('fr-FR', options); 
    return formattedDate;
}

export function computeFinalStatus( array ) {

    let finalStatus = '';
    if (array.includes("En erreur")) {
        return finalStatus = 'En erreur'
    } else if (array.includes("En attente")) {
        return finalStatus = 'En attente'
    } else if (array.includes("En cours")) {
        return finalStatus = 'En cours'
    }  else {
        finalStatus = 'Fait'
    }
    return finalStatus;
}

