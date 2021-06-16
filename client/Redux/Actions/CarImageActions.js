import axios from 'axios'
import {
    CREATE_IMAGE_FAIL,
    CREATE_IMAGE_REQUEST,
    CREATE_IMAGE_SUCCESS,
    DELETE_IMAGE_FAIL,
    DELETE_IMAGE_REQUEST,
    DELETE_IMAGE_SUCCESS
} from '../Constants/CarImageConstants'

export const createImageActions = (carnum, cardata) => async (dispatch) => {
    dispatch({
        type: CREATE_IMAGE_REQUEST,
    })
    try {
        const data = await axios.post(`/api/caim/cardata/${carnum}`, cardata)
        dispatch({ type: CREATE_IMAGE_SUCCESS, payload: data })
        return { data }
    } catch (error) {
        dispatch({ type: CREATE_IMAGE_FAIL, payload: error.response })
        return { data: error.response }
    }
}

export const deleteImageActions = (carid, imid) => async (dispatch) => {
    dispatch({
        type: DELETE_IMAGE_REQUEST
    })
    try {
        const data = await axios.delete(`/api/caim/${carid}/${imid}`)
        dispatch({ type: DELETE_IMAGE_SUCCESS, payload: data })
        return { data}
    } catch (error) {
        console.log('actions err:', error)
        dispatch({ type: DELETE_IMAGE_FAIL, payload: error.response })
        return { data: error.response }
    }
}