import axios from 'axios'

const refund = async (data) => {
    try {
        const response = await axios.post('http://192.168.100.24:3030/api/payt/refundV2', data)
        return await response.data
    } catch (error) {
        return await error.response
    }
}

export default {
    refund
}