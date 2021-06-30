import axios from 'axios'
import {
    ALL_USER_FAIL,
    ALL_USER_REQUEST,
    ALL_USER_SUCCESS,
    DELETE_USER_REQUEST,
    UPDATE_AVATAR_FAIL,
    UPDATE_AVATAR_REQUEST,
    UPDATE_AVATAR_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_SIGNUP_FAIL,
    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SPENT_FAIL,
    USER_SPENT_REQUEST,
    USER_SPENT_SUCCES,
} from '../Constants/UserConstants'

export const signupActions = (user) => async (dispatch) => {
    dispatch({
        type: USER_SIGNUP_REQUEST
    })
    try {
        const data = await axios.post(`/api/user/signup`, user)
        dispatch({ type: USER_SIGNUP_SUCCESS, payload: data })
        return { status: data.status }
    } catch (error) {
        dispatch({ type: USER_SIGNUP_FAIL, payload: error.response })
        return { status: error.response.status, message: error.response.data.message }
    }
}

export const loginActions = (user, remember) => async (dispatch) => {
    dispatch({
        type: USER_LOGIN_REQUEST
    })
    try {
        const data = await axios.post(`/api/user/login`, user)
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data})
        remember? localStorage.setItem('userData', JSON.stringify(data.data)) : sessionStorage.setItem('userData', JSON.stringify(data.data))
        return { data }
    } catch (error) {
        dispatch({ type: USER_LOGIN_FAIL, payload: error.response })
        return {data: error.response }
    }
}

export const logoutActions = () => async (dispatch) => {
    sessionStorage.removeItem('userData')
    localStorage.removeItem('userData')
    sessionStorage.removeItem('userCart')
    localStorage.removeItem('userCart')
    dispatch({ type: USER_LOGOUT})
    window.location = "/"
}

export const allUserActions = () => async (dispatch) => {
    dispatch({
        type: ALL_USER_REQUEST
    })
    try {
        const data = await axios.get('/api/user/alluser')
        dispatch({ type: ALL_USER_SUCCESS, payload: data})
    } catch (error) {
        dispatch({ type: ALL_USER_FAIL, payload: error.response })
    }
}

export const deleteUserActions = (uid) => async (dispatch) => {
    dispatch({
        type: DELETE_USER_REQUEST
    })
    try {
        const data = await axios.delete(`/api/user/${uid}`)
        return { data }
    } catch(error) {
        return { data: error.response }
    }
}

export const userSpentActions = (uid) => async (dispatch) => {
    dispatch({
        type: USER_SPENT_REQUEST
    })
    try {
        const data = await axios.get(`/api/user/myorder/succorder/${uid}`)
        dispatch({ type: USER_SPENT_SUCCES })
        return { data }
    } catch (error) {
        dispatch({ type: USER_SPENT_FAIL })
        return { data: error.response }
    }
}

export const userUpdateActions = (uid, userdata) => async (dispatch) => {
    dispatch({
        type: UPDATE_USER_REQUEST
    })
    try {
        const data = await axios.put(`/api/user/${uid}`, userdata)
        dispatch({ type: UPDATE_USER_SUCCESS })
        return { data }
    } catch (error) {
        dispatch({ type: UPDATE_USER_FAIL })
        return { data: error.response }
    }
}

export const updateAvatarActions = (uid, avatar) => async (dispatch) => {
    dispatch({
        type: UPDATE_AVATAR_REQUEST
    })
    try {
        const data = await axios.put(`/api/user/${uid}/avatar`, avatar)
        dispatch({ type: UPDATE_AVATAR_SUCCESS })
        return { data }
    } catch (error) {
        dispatch({ type: UPDATE_AVATAR_FAIL })
        return { data: error.response}
    }
}