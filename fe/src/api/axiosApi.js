import axios from 'axios';
import {config} from "../Constants";

export const axiosApi = {
    signup,
    wallet,
    login,
    addMoney,
    addTrans,
    getAllTrans,
    addCategory,
    getAllCategories,
    editTransaction,
    deleteTransaction
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
        headers: {'Authorization': 'yes@yes.y'}
    })
}

function login(user) {
    return instance.post('/user/authenticate', user, {
        headers: {'Content-type': 'application/json'}
    })
}

function addMoney(amount) {
    return instance.put('/wallet/money', amount, {
        headers: {
            'Authorization': 'yes@yes.y',
            'Content-type': 'application/json'
        }
    })
}

function addTrans(transaction) {
    return instance.post('/transaction/new', transaction, {
        headers: {
            'Authorization': 'yes@yes.y',
            'Content-type': 'application/json'
        }
    })
}

function getAllTrans() {
    return instance.get('/transaction', {
        headers: {'Authorization': 'yes@yes.y'}
    })
}

function addCategory(category) {
    return instance.post('/categories', category, {
        headers: {
            'Authorization': 'yes@yes.y',
            'Content-type': 'application/json'
        }
    })
}

function getAllCategories() {
    return instance.get('/categories', {
        headers: {'Authorization': 'yes@yes.y'}
    })
}

function editTransaction(id, transaction) {
    return instance.put('/transaction/' + id, transaction, {
        headers: {
            'Authorization': 'yes@yes.y',
            'Content-type': 'application/json'
        }
    })
}

function deleteTransaction(id) {
    return instance.delete('/transaction/' + id, {
        headers: {'Authorization': 'yes@yes.y'}
    })
}