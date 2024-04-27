import Cookies from "js-cookie"

const token = Cookies.get('token')
const headers = {
    'Authorization': 'Bearer '+ token
}

export { token, headers }