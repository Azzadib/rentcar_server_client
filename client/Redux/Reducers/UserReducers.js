import {
    ALL_USER_FAIL,
    ALL_USER_REQUEST,
    ALL_USER_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_SIGNUP_FAIL,
    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS
} from '../Constants/UserConstants'

export const userSignupReducers = (
    state = { loading: true, user: {} },
    action
) => {
    switch (action.type) {
        case USER_SIGNUP_REQUEST:
            return { loading: true }
        case USER_SIGNUP_SUCCESS:
            return {
                loading: false,
                user: action.payload.data
            }
        case USER_SIGNUP_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const userLoginReducers = (
    state = { loading: true, user: {}, token: '' },
    action
) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return {
                loading: false,
                user: action.payload.data,
            }
        case USER_LOGIN_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const allUserReducers = (
    state = { loading: true, alluser: [] },
    action
) => {
    switch (action.type) {
        case ALL_USER_REQUEST:
            return { loading: true }
        case ALL_USER_SUCCESS:
            return {
                loading: false,
                alluser: action.payload.data,
            }
        case ALL_USER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}