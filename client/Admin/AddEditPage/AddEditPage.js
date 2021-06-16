import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../../Components/NavBar'
import HandleCar from './HandleCar'

export default function AddEditPage() {
  const userinfo = useSelector(state => state.login)
  const { user } = userinfo
  if (user.user_type !== 'Admin') window.location = "/"

  return (
    <>
      <header>
        <NavBar/>
      </header>
      <main>
        <HandleCar/>
      </main>
    </>
  )
}