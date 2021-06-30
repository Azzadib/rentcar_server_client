import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/images/logo.png'
import { Menu, Transition } from '@headlessui/react'
import { LogoutIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { Link, useHistory } from 'react-router-dom'
import { logoutActions } from '../Redux/Actions/UserActions'
import garagesvg from '../assets/svg/garage.svg'
import wavesvg from '../assets/svg/wave.svg'
import avatar from '../assets/svg/avatar.svg'

export default function NavBar() {
  const [logedin, setLogedin] = useState(false)
  const [profile, setProfile] = useState()
  const [isadmin, setIsadmin] = useState(false)
  const dispatch = useDispatch()
  const [count, setCount] = useState(0)
  const history = useHistory()

  const position = useSelector(state => state.scrollPosition)
  const { isOnTop } = position

  const userdata = useSelector(state => state.login)
  const cartData = useSelector(state => state.cart)
  useEffect(() => {
    if (userdata) {
      const { user } = userdata
      if (user) setLogedin(true)
      if (user.user_type === 'Admin') setIsadmin(true)
      setProfile(user)
    }
  }, [dispatch])

  useEffect(() => {
    if (cartData) {
      const { line_items } = cartData
      if (line_items) setCount(line_items.length)
    }
  }, [isOnTop, dispatch, cartData, logedin])

  return (
    <>
      <div className="w-screen fixed z-50">
        <div className={`${isOnTop ? 'bg-transparent' : 'bg-gradient-to-b from-gray-400 via-gray-200 to-white'} flex`}>
          <div onClick={() => history.push('/')} className="hover:cursor-pointer">
            <img src={logo} className="w-20 my-2 mx-4" />
          </div>
          <Transition
            as={Fragment}
            show={isOnTop}
            enter="transform transition duration-300"
            enterFrom="-translate-x-72"
            enterTo="translate-x-0"
            leave="transform transition duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-72"
          >
            <div className="bg-white backdrop-filter backdrop-blur-sm bg-opacity-20 text-red-500 my-auto px-4 py-2 rounded-full">
              <span className="text-4xl font-bold">Rentcar.id</span>
            </div>
          </Transition>
          <div className="my-auto absolute right-16 flex">
            <Link Link to={{
              pathname: '/garage',
              from: '/garage'
            }}>
              <button className="mt-5 flex focus:outline-none hover:transform hover:scale-105">
                <img src={garagesvg} className="w-11" title="Garage" />
                <div className="bg-red-500 text-white rounded-full text-lg font-bold px-2 -ml-4">{count}</div>
              </button>
            </Link>
            <Link to={{
              pathname: '/login',
              from: typeof window === 'object' ? window.location.href ? window.location.href : '/' : '/'
            }}>
              <button className={logedin ? 'hidden' : 'ml-5 mt-5 text-lg font-semibold bg-white px-4 border-b-4 border-r-4 rounded-xl hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none active:ml-6 focus:outline-none'}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className={logedin ? 'hidden' : 'ml-5 mt-5 text-lg font-semibold bg-white px-4 border-b-4 border-r-4 rounded-xl hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none active:ml-6 focus:outline-none'}>
                Signup
              </button>
            </Link>
            <Link to={{
              pathname: '/admin',
              from: typeof window === 'object' ? window.location.href ? window.location.href : '/' : '/'
            }}>
              <button className={isadmin ? 'ml-5 mt-5 text-lg py-2 font-semibold bg-white px-4 border-b-4 border-r-4 rounded-xl hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none active:ml-6 focus:outline-none' : 'hidden'}>
                Dashboard
              </button>
            </Link>
            <Menu as="div" className={logedin? '' : 'hidden'}>
              <div className="">
                <Menu.Button className="justify-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <img src={profile? profile.user_avatar? `http://localhost:3000/api/user/avatar/${profile.user_id}/${profile.user_avatar}` : avatar : avatar}
                    className="w-12 ml-5 mt-5 rounded-full border-b-2 border-r-2 hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none"/>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute -right-9 w-28 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={() => window.location="/myorder"}
                          className={`${active ? 'bg-purple-800 text-white' : ' text-purple-800'} font-semibold group flex rounded-xl items-center w-full px-2 py-2 text-sm focus:outline-none`}
                        >
                          My Orders
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={()=> window.location = "/profile"}
                          className={`${active ? 'bg-purple-800 text-white' : ' text-purple-800'} font-semibold group flex rounded-xl items-center w-full px-2 py-2 text-sm focus:outline-none`}
                        >
                          My Profile
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-purple-800 text-white' : ' text-purple-800'} font-semibold group flex rounded-xl items-center w-full px-1 py-2 text-sm focus:outline-none`}
                        >
                          <QuestionMarkCircleIcon className="w-6 mr-2"/>
                          Help
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={() => dispatch(logoutActions())}
                          className={`${active ? 'bg-purple-800 text-white' : ' text-purple-800'} font-semibold group flex rounded-xl items-center w-full px-1 py-2 text-sm focus:outline-none`}
                        >
                          <LogoutIcon className="w-6 mr-2"/>
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className={logedin? 'mt-8 ml-2' : 'hidden'}>{ profile? profile.user_name.split(' ')[0] : '' }</div>
          </div>
        </div>
        <img src={wavesvg} className={`${isOnTop || (window.location.href !== 'http://localhost:3000/') ? 'hidden' : ''} w-screen`} />
      </div>
    </>
  )
}