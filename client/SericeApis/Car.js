import axios from 'axios'

const getCar = async(id) => {
    try {
        let response = await axios.get(`/api/car/${id}`)
        return await response.data
    } catch (err) {
        return await err.response
    }
}

export default {
    getCar,
}