const prod = {
    url: {
        API_BASE_URL: ''
    }
}

const dev = {
    url: {
        API_BASE_URL: 'http://localhost:8080/rest'
    }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;