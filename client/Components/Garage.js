import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import garagesvg from '../assets/svg/garage.svg'

export default function Garage(props) {
  const { change } = props
  const [count, setCount] = useState(0)
  let cartData = useSelector(state => state.cart)
  useEffect(() => {
    setTimeout(() => {
      const { line_items } = cartData
      setCount(line_items.length)
    }, 100)
  }, [change])
  
  
  return (
    <button className="mt-5 flex focus:outline-none hover:transform hover:scale-105">
      <img src={garagesvg} className="w-11" title="Garage" />
      <div className="bg-red-500 text-white rounded-full text-lg font-bold px-2 -ml-4">{change? change : count}</div>
    </button>
  )
}