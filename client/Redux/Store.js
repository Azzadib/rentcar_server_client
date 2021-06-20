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
import { allOrderReducers, oneOrderReducers, orderLiteReducers, updateOrderReducers } from './Reducers/OrderReducers'
import { scrollReducers } from './Reducers/ScrollReducers'
import {
    userLoginReducers,
    userSignupReducers
} from './Reducers/UserReducers'

const initialState = {
    login: typeof window === "object" ?
        localStorage.getItem('userData') ?
            JSON.parse(localStorage.getItem('userData'))
            :
            sessionStorage.getItem('userData') ?
                JSON.parse(sessionStorage.getItem('userData'))
                :
                null
        :
        null,
    cart: typeof window === "object" ?
        localStorage.getItem('userCart') ?
            JSON.parse(localStorage.getItem('userCart'))
            :
            sessionStorage.getItem('userCart') ?
                JSON.parse(sessionStorage.getItem('userCart'))
                :
                null
        :
        null,
    allorder: typeof window === "object" ?
        localStorage.getItem('userOrders') ?
            JSON.parse(localStorage.getItem('userOrders'))
            :
            sessionStorage.getItem('userOrders') ?
                JSON.parse(sessionStorage.getItem('userOrders'))
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
    allorder: allOrderReducers,
    oneorder: oneOrderReducers,
    orderlite: orderLiteReducers,
    orderupdated: updateOrderReducers,
    signUp: userSignupReducers,
})

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
)

export default store