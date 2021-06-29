import axios from 'axios'
import {
    ADD_LITE_FAIL,
    ADD_LITE_REQUEST,
    ADD_LITE_SUCCESS,
    DELETE_LITE_REQUEST,
    EDIT_LITE_REQUEST,
} from '../Constants/LiteConstants'

export const addLiteActions = (uid, carnum, dates) => async (dispatch) => {
    dispatch({
        type: ADD_LITE_REQUEST
    })
    try {
        const data = await axios.post(`/api/trans/tocart/${uid}/${carnum}`, dates)
        console.log('called1')
        dispatch({ type: ADD_LITE_SUCCESS, payload: data })
        console.log('called2')
        return { data }
    } catch (error) {
        dispatch({ type: ADD_LITE_FAIL, payload: error.response })
        return { data: error.response}
    }
}

export const editLiteActions = (id, days) => async (dispatch) => {
    dispatch({
        type: EDIT_LITE_REQUEST
    })
    try {
        const data = await axios.put(`/api/trans/itemedit/${id}`, days)
        return { data }
    } catch (error) {
        return { data: error.response}
    }
}

export const deleteLiteActions = (id) => async (dispatch) => {
    dispatch({
        type: DELETE_LITE_REQUEST
    })
    try {
        const data = await axios.delete(`/api/trans/itemdelete/${id}`)
        return { data }
    } catch (error) {
        return { data: error.response}
    }
}