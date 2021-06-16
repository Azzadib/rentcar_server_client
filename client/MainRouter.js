import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AddEditPage from './Admin/AddEditPage/AddEditPage'
import AdminRoute from './auth/AdminRoute'
import PrivateRoute from './auth/PrivateRoute'
import CarByTypePage from './Pages/CarByType/CarByTypePage'
import DetailPage from './Pages/DetailPage/DetailPage'
import GaragePage from './Pages/GaragePage/GaragePage'
import InvoicePage from './Pages/InvoicePage/InvoicePage'
import LandingPage from './Pages/LandingPage/LandingPage'
import LoginPage from './Pages/UserPage/LoginPage'
import SignupPage from './Pages/UserPage/SignupPage'

const MainRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/login" exact component={LoginPage} />
        <Route path="/signup" exact component={SignupPage}/>
        <Route path="/" exact component={LandingPage} />
        <Route path="/view/:type" exact component={CarByTypePage} />
        <Route path="/detail/:id" exact component={DetailPage} />
        <Route path="/order/result" exact component={InvoicePage}/>
        <PrivateRoute path="/garage" exact component={GaragePage} />
        <PrivateRoute path="/admin/addcar" exact component={AddEditPage}/>
        <PrivateRoute path="/admin/editcar/:carid" exact component={AddEditPage}/>
      </Switch>
    </>
  )
}

export default MainRouter