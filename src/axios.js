import axios from 'axios'

const instance = axios.create({
    // baseURL: 'http://localhost:3535',
    baseURL: 'your server url if you want to push to production'
})

export default instance