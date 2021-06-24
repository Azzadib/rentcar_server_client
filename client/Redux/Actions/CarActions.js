import axios from 'axios'
import {
    ALL_CAR_FAIL,
    ALL_CAR_REQUEST,
    ALL_CAR_SUCCESS,
    CAR_BYTYPE_FAIL,
    CAR_BYTYPE_REQUEST,
    CAR_BYTYPE_SUCCESS,
    CAR_DETAIL_FAIL,
    CAR_DETAIL_REQUEST,
    CAR_DETAIL_SUCCESS,
    CREATE_CAR_FAIL,
    CREATE_CAR_REQUEST,
    CREATE_CAR_SUCCESS,
    DELETE_CAR_FAIL,
    DELETE_CAR_REQUEST,
    DELETE_CAR_SUCCESS,
    EDIT_CAR_FAIL,
    EDIT_CAR_REQUEST,
    EDIT_CAR_SUCCESS,
} from '../Constants/CarConstants'

export const carByTypeActions = (carType, query) => async (dispatch) => {
    dispatch({
        type: CAR_BYTYPE_REQUEST,
    })
    try {
        const data = await axios.get(`/api/car/type/${carType}?${query}`)
        dispatch({ type: CAR_BYTYPE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: CAR_BYTYPE_FAIL, payload: error.response })
    }
}

export const carDetailActions = (id) => async (dispatch) => {
    dispatch({
        type: CAR_DETAIL_REQUEST,
    })
    try {
        const data = await axios.get(`/api/car/${id}`)
        dispatch({ type: CAR_DETAIL_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: CAR_DETAIL_FAIL, payload: error.response })
    }
}

export const createCarActions = (number, cardata) => async (dispatch) => {
    dispatch({
        type: CREATE_CAR_REQUEST,
    })
    try {
        const data = await axios.post(`/api/car/cardata/${number}`, cardata)
        dispatch({ type: CREATE_CAR_SUCCESS, payload: data})
        return { data }
    } catch (error) {
        dispatch({ type: CREATE_CAR_FAIL, payload: error.response})
        return { data: error.response }
    }
}

export const editCarActions = (carid, cardata) => async (dispatch) => {
    dispatch({
        type: EDIT_CAR_REQUEST
    })
    try {
        const data = await axios.put(`/api/car/${carid}`, cardata)
        dispatch({ type: EDIT_CAR_SUCCESS, payload: data })
        return { data}
    } catch (error) {
        dispatch({ type: EDIT_CAR_FAIL, payload: error.response })
        return { data: error.response }
    }
}

export const allCarActions = () => async (dispatch) => {
    dispatch({
        type: ALL_CAR_REQUEST
    })
    try {
        const data = await axios.get('/api/car/allcar')
        dispatch({ type: ALL_CAR_SUCCESS, payload: data })
    }
    catch (error) {
        dispatch({ type: ALL_CAR_FAIL, payload: error.response })
    }
}

export const deleteCarActions = (cid) => async (dispatch) => {
    dispatch({
        type: DELETE_CAR_REQUEST
    })
    try {
        const data = await axios.delete(`/api/car/${cid}`)
        dispatch({ type: DELETE_CAR_SUCCESS, payload: data })
        return { data }
    } catch (error) {
        dispatch({ type: DELETE_CAR_FAIL, payload: error.response })
        return { data: error.response }
    }
}