import React from 'react'
import NavBar from '../../Components/NavBar'
import ToTop from '../../Components/ToTop'
import OrderList from './OrderList'

export default function OrderListPage() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <OrderList />
        <ToTop />
      </main>
    </>
  )
}