import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {
    carByTypeReducers,
    carDetailReducers,
} from './Reducers/CarReducers'
import {
    cartCheckoutReducers,
    cartListReducers,
    cartSummaryReducers,
} from './Reducers/CartReducers'
import {
    addLiteReducers,
} from './Reducers/LiteReducers'
import { scrollReducers } from './Reducers/ScrollReducers'
import {
    userLoginReducers,
    userSignupReducers
} from './Reducers/UserReducers'

const initialState = {
    login: typeof window === "object"? 
            localStorage.getItem('userData')? 
                JSON.parse(localStorage.getItem('userData'))
                :
                sessionStorage.getItem('userData')?
                    JSON.parse(sessionStorage.getItem('userData'))
                    :
                    null
            :
            null,
    cart: typeof window === "object"? 
            localStorage.getItem('userCart')? 
                JSON.parse(localStorage.getItem('userCart'))
                :
                sessionStorage.getItem('userCart')?
                    JSON.parse(sessionStorage.getItem('userCart'))
                    :
                    null
            :
            null,
}

const reducer = combineReducers({
    carByTypeLists: carByTypeReducers,
    carDetail: carDetailReducers,
    scrollPosition: scrollReducers,
    login: userLoginReducers,
    cart: cartListReducers,
    cartsum: cartSummaryReducers,
    cartcheckout: cartCheckoutReducers,
    lite: addLiteReducers,
    signUp: userSignupReducers,
})

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
)

export default store