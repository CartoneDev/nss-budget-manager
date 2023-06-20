import axios from 'axios';
import {config} from "../Constants";

export const axiosApi = {
    signup,
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