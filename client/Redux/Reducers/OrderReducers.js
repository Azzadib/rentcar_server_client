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

export const allOrderReducers = (
    state = { loading: true, orders: [] },
    action
) => {
    switch (action.type) {
        case ALL_ORDER_REQUEST:
            return { loading: true }
        case ALL_ORDER_SUCCES:
            return {
                loading: false,
                orders: action.payload.data
            }
        case ALL_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const oneOrderReducers = (
    state = { loading: true, order: {} },
    action
) => {
    switch (action.type) {
        case ONE_ORDER_REQUEST:
            return { loading: true }
        case ONE_ORDER_SUCCES:
            return {
                loading: false,
                order: action.payload.data
            }
        case ONE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const orderLiteReducers = (
    state = { loading: true, orderlite: [] },
    action
) => {
    switch (action.type) {
        case ORDER_LITE_REQUEST:
            return { loading: true }
        case ORDER_LITE_SUCCES:
            return {
                loading: false,
                orderlite: action.payload.data
            }
        case ORDER_LITE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const updateOrderReducers = (
    state = { loading: true, orderupdated: {} },
    action
) => {
    switch (action.type) {
        case UPDATE_ORDER_REQUEST:
            return { loading: true }
        case UPDATE_ORDER_SUCCES:
            return {
                loading: false,
                orderupdated: action.payload.data
            }
        case UPDATE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const globalOrderReducers = (
    state = { loading: true, globalorder: [] },
    action
) => {
    switch (action.type) {
        case GLOBAL_ORDER_REQUEST:
            return { loading: true }
        case GLOBAL_ORDER_SUCCES:
            return {
                loading: false,
                globalorder: action.payload.data,
            }
        case GLOBAL_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}