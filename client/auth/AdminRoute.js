import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './AuthHelper'

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        auth.isAdmin() ? 
        (
          <Component {...props}/>
        ) 
        : 
        (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location },
            search: `?redirect=${props.location.pathname}`
          }}/>
        )
      )}/>
)

export default AdminRoute