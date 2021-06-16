import React from 'react'
import ToTop from '../../Components/ToTop'
import Cars from './Cars'
import NavBar from '../../Components/NavBar'

export default function CarByTypePage() {
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <main>
        <Cars/>
        <ToTop/>
      </main>
    </>
  )
}
