import axios from "axios"

const orderCount = async () => {
    try {
        let response = await axios.get('/api/trans/ordercount')
        return await response.data
    } catch (error) {
        return await error.response
    }
}

const carCount = async () => {
    try {
        let response = await axios.get('/api/car/admin/carcount')
        return await response.data
    } catch (error) {
        return await error.response
    }
}

const userCount = async () => {
    try {
        let response = await axios.get('/api/user/admin/usercount')
        return await response.data
    } catch (error) {
        return await error.response
    }
}

export default {
    orderCount,
    carCount,
    userCount
}