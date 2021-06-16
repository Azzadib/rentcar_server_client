import {
    CART_CHECKOUT_FAIL,
    CART_CHECKOUT_REQUEST,
    CART_CHECKOUT_SUCCESS,
    CART_LIST_FAIL,
    CART_LIST_REQUEST,
    CART_LIST_SUCCESS,
    CART_SUMMARY_FAIL,
    CART_SUMMARY_REQUEST,
    CART_SUMMARY_SUCCESS
} from "../Constants/CartConstants"

export const cartListReducers = (
    state = { loading: true, cart: {} },
    action
) => {
    switch (action.type) {
        case CART_LIST_REQUEST:
            return { loading: true }
        case CART_LIST_SUCCESS:
            return {
                loading: false,
                cart: action.payload.data
            }
        case CART_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const cartSummaryReducers = (
    state = { loading: true, cartsum: {} },
    action
) => {
    switch (action.type) {
        case CART_SUMMARY_REQUEST:
            return { loading: true }
        case CART_SUMMARY_SUCCESS:
            return {
                loading: false,
                cartsum: action.payload.data
            }
        case CART_SUMMARY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const cartCheckoutReducers = (
    state = { loading: true, checkout: {} },
    action
) => {
    switch (action.type) {
        case CART_CHECKOUT_REQUEST:
            return { loading: true }
        case CART_CHECKOUT_SUCCESS:
            return {
                loading: false,
                checkout: action.payload.data
            }
        case CART_CHECKOUT_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}