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
} from "../Constants/CarConstants";

export const carByTypeReducers = (
    state = { loading: true, cars: [] },
    action
) => {
    switch (action.type) {
        case CAR_BYTYPE_REQUEST:
            return { loading: true }
        case CAR_BYTYPE_SUCCESS:
            return {
                loading: false,
                cars: action.payload.data
            }
        case CAR_BYTYPE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const carDetailReducers = (
    state = { loading: true, car: {} },
    action
) => {
    switch (action.type) {
        case CAR_DETAIL_REQUEST:
            return { loading: true }
        case CAR_DETAIL_SUCCESS:
            return {
                loading: false,
                car: action.payload.data
            }
        case CAR_DETAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const allCarReducers = (
    state = { loading: true, allcar: [] },
    action
) => {
    switch (action.type) {
        case ALL_CAR_REQUEST:
            return { loading: true }
        case ALL_CAR_SUCCESS:
            return {
                loading: false,
                allcar: action.payload.data
            }
        case ALL_CAR_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}