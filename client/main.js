import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './assets/styles/index.css'
import store from './Redux/Store'

hydrate(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)