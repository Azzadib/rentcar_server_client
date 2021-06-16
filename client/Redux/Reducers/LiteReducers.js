import {
    ADD_LITE_FAIL,
    ADD_LITE_REQUEST,
    ADD_LITE_SUCCESS,
} from "../Constants/LiteConstants";

export const addLiteReducers = (
    state = { loading: true, lite: {} },
    action
) => {
    switch (action.type) {
        case ADD_LITE_REQUEST:
            return { loading: true }
        case ADD_LITE_SUCCESS:
            return {
                loading: false,
                lite: action.payload.data
            }
        case ADD_LITE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}