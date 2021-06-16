import React from 'react'
import CarType from './CarTypes'
import Footer from './Footer'
import Hero from './Hero'
import NavBar from '../../Components/NavBar'
import ToTop from '../../Components/ToTop'
import WeDone from './WeDone'

export default function LandingPage() {
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <main>
        <Hero/>
        <CarType/>
        <WeDone/>
        <ToTop />
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  )
}