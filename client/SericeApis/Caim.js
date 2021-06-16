import axios from 'axios'

const download = async(number, filename) => {
    try {
        let response = await axios.get(`/api/caim/cardata/${number}/${filename}`, { responseType: 'blob'})
        return new File([response.data], filename)
    } catch (err) {
        return await err.response
    }
}

export default {
    download,
}