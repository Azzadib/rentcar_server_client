import axios from 'axios'
import {
    ALL_ORDER_FAIL,
    ALL_ORDER_REQUEST,
    ALL_ORDER_SUCCES,
    GLOBAL_ORDER_FAIL,
    GLOBAL_ORDER_REQUEST,
    GLOBAL_ORDER_SUCCES,
    ONE_ORDER_FAIL,
    ONE_ORDER_REQUEST,
    ONE_ORDER_SUCCES,
    ORDER_LITE_FAIL,
    ORDER_LITE_REQUEST,
    ORDER_LITE_SUCCES,
    UPDATE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCES
} from '../Constants/OrderConstants'

export const allOrderActions = (uid) => async (dispatch) => {
    dispatch ({
        type: ALL_ORDER_REQUEST
    })
    try {
        const data = await axios.get(`/api/trans/myorders/${uid}`)
        dispatch({ type: ALL_ORDER_SUCCES, payload: data })
        localStorage.getItem('userData')? localStorage.setItem('userOrders', JSON.stringify(data.data)) : sessionStorage.setItem('userOrders', JSON.stringify(data.data))
        return { data }
    } catch (error) {
        dispatch({ type: ALL_ORDER_FAIL, payload: error.response })
        return { data: error.response }
    }
}

export const oneOrderActions = (name) => async (dispatch) => {
    dispatch ({
        type: ONE_ORDER_REQUEST
    })
    try {
        const data = await axios.get(`/api/trans/order/${name}`)
        dispatch({ type: ONE_ORDER_SUCCES, payload: data })
    } catch (error) {
        dispatch({ type: ONE_ORDER_FAIL, payload: error.response })
    }
}

export const orderLiteActions = (name) => async (dispatch) => {
    dispatch ({
        type: ORDER_LITE_REQUEST
    })
    try {
        const data = await axios.get(`/api/trans/byorder/${name}`)
        dispatch({ type: ORDER_LITE_SUCCES, payload: data })
    } catch (error) {
        dispatch({ type: ORDER_LITE_FAIL, payload: error.response })
    }
}

export const updateOrderActions = (status, name, pytnum) => async (dispatch) => {
    dispatch ({
        type: UPDATE_ORDER_REQUEST
    })
    try {
        const data = await axios.put(`/api/trans/order/${status}/${name}`, pytnum)
        dispatch({ type: UPDATE_ORDER_SUCCES, payload: data })
        return { data }
    } catch (error) {
        dispatch({ type: UPDATE_ORDER_FAIL, payload: error.response })
        return { data: error.response }
    }
}

export const globalOrderActions = () => async (dispatch) => {
    dispatch({
        type: GLOBAL_ORDER_REQUEST
    })
    try {
        const data = await axios.get('/api/trans/allorder')
        dispatch({ type: GLOBAL_ORDER_SUCCES, payload: data })
    } catch (error) {
        dispatch({ type: GLOBAL_ORDER_FAIL, payload: error.respone })
    }
}