import axios from 'axios'
import {
    CART_CHECKOUT_FAIL,
    CART_CHECKOUT_REQUEST,
    CART_CHECKOUT_SUCCESS,
    CART_LIST_FAIL,
    CART_LIST_REQUEST,
    CART_LIST_SUCCESS,
    CART_SUMMARY_FAIL,
    CART_SUMMARY_REQUEST,
    CART_SUMMARY_SUCCESS,
} from "../Constants/CartConstants"

export const cartListActions = (uid) => async (dispatch) => {
    dispatch({
        type: CART_LIST_REQUEST
    })
    try {
        const data = await axios.get(`/api/trans/opencart/${uid}`)
        dispatch({ type: CART_LIST_SUCCESS, payload: data })
        localStorage.getItem('userData')? localStorage.setItem('userCart', JSON.stringify(data.data)) : sessionStorage.setItem('userCart', JSON.stringify(data.data))
        return { data }
    } catch (error) {
        dispatch({ type: CART_LIST_FAIL, payload: error.response })
        return { data: error.response}
    }
}

export const cartSummaryActions = (cartid) => async (dispatch) => {
    dispatch({
        type: CART_SUMMARY_REQUEST
    })
    try {
        const data = await axios.get(`/api/trans/sum/${cartid}`)
        dispatch({ type: CART_SUMMARY_SUCCESS, payload: data })
        localStorage.getItem('userData')? localStorage.setItem('userCartSummary', JSON.stringify(data.data)) : sessionStorage.setItem('userCartSummary', JSON.stringify(data.data))
        return { data }
    } catch (error) {
        dispatch({ type: CART_SUMMARY_FAIL, payload: error.response })
        return { data: error.response}
    }
}

export const cartCheckoutActions = (cartid, detail) => async (dispatch) => {
    dispatch({
        type: CART_CHECKOUT_REQUEST
    })
    try {
        const data = await axios.post(`/api/trans/order/${cartid}`, detail)
        dispatch({ type: CART_CHECKOUT_SUCCESS, payload: data.data})
        return { data }
    } catch (error) {
        dispatch({ type: CART_CHECKOUT_FAIL, payload: error.response})
        return { data: error.response }
    }
}