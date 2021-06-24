import React from 'react'
import CarType from './CarTypes'
import Footer from './Footer'
import Hero from './Hero'
import NavBar from '../../Components/NavBar'
import ToTop from '../../Components/ToTop'
import WhyUs from './WhyUs'

export default function LandingPage() {
  return (
    <>
      <header>
        <NavBar/>
      </header>
      <main>
        <Hero/>
        <CarType/>
        <WhyUs/>
        <ToTop/>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  )
}