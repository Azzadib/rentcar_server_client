import React from 'react'
import NavBar from '../../Components/NavBar'
import Invoice from './Invoice'

export default function InvoicePage() {
    return (
        <>
            <header>
                <NavBar/>
            </header>
            <main>
                <Invoice/>
            </main>
        </>
    )
}