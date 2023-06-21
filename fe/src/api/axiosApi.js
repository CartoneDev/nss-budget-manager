import axios from 'axios';
import {config} from "../Constants";

export const axiosApi = {
    signup,
    wallet,
    login
}

const instance = axios.create({
    // baseURL: config.url.API_BASE_URL
    baseURL: 'http://localhost:8080/rest/'
})

function signup(user) {
    return instance.post('/user/register', user, {
        headers: {'Content-type': 'application/json'}
    })
}

function wallet() {
    return instance.get('/wallet/myWallet', {
        headers: {'Authorization': 'no@no.no'}
    })
}

function login(user) {
    return instance.post('/user/authenticate', user, {
        headers: {'Content-type': 'application/json'}
    })
}