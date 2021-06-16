import { PAGE_NOT_ON_TOP, PAGE_ON_TOP } from "../Constants/ScrollConstants"

export const scrollReducers = (
    state = { isOnTop: true },
    action
) => {
    switch (action.type) {
        case PAGE_ON_TOP:
            return { isOnTop: true }
        case PAGE_NOT_ON_TOP:
            return { isOnTop: false }
        default:
            return state
    }
}