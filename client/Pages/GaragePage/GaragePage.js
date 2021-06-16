import React from 'react'
import NavBar from '../../Components/NavBar'
import ItemList from './ItemList'

export default function GaragePage() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <ItemList />
      </main>
    </>
  )
}