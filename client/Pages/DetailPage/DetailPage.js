import React from 'react'
import CarDetail from './CarDetail'
import NavBar from '../../Components/NavBar'
import ToTop from '../../Components/ToTop'

export default function DetailPage() {
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <main>
        <CarDetail/>
        <ToTop/>
      </main>
    </>
  )
}