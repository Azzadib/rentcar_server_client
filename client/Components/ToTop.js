import React, { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import rocketIcon from '../assets/svg/rocket.svg'
import fireIcon from '../assets/svg/fire.svg'
import { Transition } from '@headlessui/react'

export default function ToTop() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const position = useSelector(state => state.scrollPosition)
  const { isOnTop } = position 

  return (
    <Transition
      as={Fragment}
      show={!isOnTop}
      enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
      <button className="fixed right-1 bottom-3 animate-bounce z-50 focus:outline-none" onClick={scrollToTop}>
        <img src={rocketIcon} className="w-16 mx-auto" />
        <img src={fireIcon} className="w-8 mx-auto transform rotate-180 animate-pulse-fast" />
      </button>
    </Transition>
  )
}