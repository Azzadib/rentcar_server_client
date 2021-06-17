import { PAGE_NOT_ON_TOP, PAGE_ON_TOP } from "../Constants/ScrollConstants"

export const scrollActions = (scrollPos) => async (dispatch) => {
    scrollPos >= 40? dispatch({type: PAGE_NOT_ON_TOP}) : dispatch({type: PAGE_ON_TOP})
}