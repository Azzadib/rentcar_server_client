import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AddEditPage from './Admin/AddEditPage/AddEditPage'
import DashboardPage from './Admin/DashboardPage/DashboardPage'
import AdminRoute from './auth/AdminRoute'
import PrivateRoute from './auth/PrivateRoute'
import CarByTypePage from './Pages/CarByType/CarByTypePage'
import DetailPage from './Pages/DetailPage/DetailPage'
import FeedbackPage from './Pages/FeedbackPage/FeedbackPage'
import GaragePage from './Pages/GaragePage/GaragePage'
import InvoicePage from './Pages/InvoicePage/InvoicePage'
import LandingPage from './Pages/LandingPage/LandingPage'
import OrderListPage from './Pages/OrderListPage/OrderListPage'
import ProfilePage from './Pages/ProfilePage/ProfilePage'
import LoginPage from './Pages/UserPage/LoginPage'
import SignupPage from './Pages/UserPage/SignupPage'

const MainRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/signup" exact component={SignupPage}/>
        <Route path="/login" exact component={LoginPage}/>
        <Route path="/" exact component={LandingPage}/>
        <Route path="/view/:type" exact component={CarByTypePage}/>
        <Route path="/detail/:id" exact component={DetailPage}/>
        <PrivateRoute path="/profile" exact component={ProfilePage}/>
        <PrivateRoute path="/feedback" exact component={FeedbackPage}/>
        <PrivateRoute path="/garage" exact component={GaragePage}/>
        <PrivateRoute path="/myorder" exact component={OrderListPage}/>
        <PrivateRoute path="/order/result" exact component={InvoicePage}/>
        <PrivateRoute path="/admin" exact component={DashboardPage}/>
        <PrivateRoute path="/admin/addcar" exact component={AddEditPage}/>
        <PrivateRoute path="/admin/editcar/:carid" exact component={AddEditPage}/>
      </Switch>
    </>
  )
}

export default MainRouter