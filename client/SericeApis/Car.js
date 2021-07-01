import axios from 'axios'

const getCar = async(id) => {
    try {
        let response = await axios.get(`/api/car/${id}`)
        return await response.data
    } catch (err) {
        return await err.response
    }
}

const setComment = async(uid, carnum, comment) => {
    try {
        let response = await axios.post(`/api/comment/${uid}/${carnum}`, comment)
        return await response
    } catch (error) {
        return await error.response
    } 
}

export default {
    getCar,
    setComment
}