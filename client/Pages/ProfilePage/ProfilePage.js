import React from 'react'
import NavBar from '../../Components/NavBar'
import Profile from './Profile'

export default function ProfilePage() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Profile />
      </main>
    </>
  )
}