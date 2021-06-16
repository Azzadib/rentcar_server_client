import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import holdPhone from '../../assets/svg/holding-phone.svg'
import { ChevronDoubleDownIcon } from '@heroicons/react/solid'
import { Link as ScrollLink } from 'react-scroll'
import { scrollActions } from '../../Redux/Actions/ScrollActions'

export default function Hero() {
  const bgImage = 'http://www.sportshdwallpapers.com/download/porche-sport-car-boxter-s-in-nature_1920x1080_469-hd.jpg'

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const dispatch = useDispatch()
  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  return (
    <>
      <div className="h-100v max-w-screen-2xl" style={{ backgroundImage: 'url(' + bgImage + ')' }}>
        <div className="px-10 pt-32">
          <div className='bg-white backdrop-filter max-w-sm backdrop-blur-sm bg-opacity-10 rounded-3xl p-2 text-black0 border-gray-300 shadow-lg'>
            <div className="w-full mb-3 pb-3 border-b border-1 border-red-700">
              <h3 className="text-xl font-semibold text-shadow">Happy Traveling</h3>
            </div>
            <div>
              <img src={holdPhone} className="w-full h-30v object-contain mb-2" />
              <p className="mb-3 mx-auto tracking-wide text-base text-shadow max-h-12 overflow-hidden font-semibold">
                Plan your amazing travel. Choose your favourite car from your seat, let us do the rest!.
              </p>
              <ScrollLink to="car_type" smooth="true" duration={500}>
                <button className="backdrop flex bg-white border border-white mx-auto px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 hover:bg-opacity-10 text-lg hover:transform hover:scale-110">
                  Start Hunting <ChevronDoubleDownIcon className="text-red-500 mt-2 ml-2 animate-bounce w-5" />
                </button>
              </ScrollLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}