import React from 'react'
import NavBar from '../../Components/NavBar'
import OrderResult from './OrderResult'

export default function InvoicePage() {
    return (
        <>
            <header>
                <NavBar/>
            </header>
            <main>
                <OrderResult/>
            </main>
        </>
    )
}