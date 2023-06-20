import axios from 'axios';
import {config} from "../Constants";

const instance = axios.create({
    baseURL: config.url.API_BASE_URL
})

function signup(user) {
    return instance.post('/user/register', user, {
        headers: {'Content-type': 'application/json'}
    })
}