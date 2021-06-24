import React from 'react'
import NavBar from '../../Components/NavBar'
import ToTop from '../../Components/ToTop'
import Dashboard from './Dashboard'

export default function DashboardPage() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Dashboard/>
        <ToTop/>
      </main>
    </>
  )
}