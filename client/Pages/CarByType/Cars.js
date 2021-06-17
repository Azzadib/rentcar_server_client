import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { carByTypeActions } from '../../Redux/Actions/CarActions'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import { useParams } from 'react-router-dom'
import Carcards from '../../Components/CarCards'
import LoadingCarCards from '../../Components/Loadingcarcards'
import search1 from '../../assets/images/search1.png'
import searcherror from '../../assets/svg/search-error.svg'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

export default function Cars() {
  const { type } = useParams()
  const [showsorry, setShowsorry] = useState(false)
  const [query, setQuery] = useState()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(carByTypeActions(type, query))
  }, [dispatch, query])

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  const carLists = useSelector((state) => state.carByTypeLists)
  const { loading, error, cars } = carLists

  if (error) {
    console.log(`error status: ${error && error.status}`)
    console.log(`error status: ${error && error.data.message}`)
  }

  const runCallback = (cb) => {
    return cb()
  }

  const manufacturerLists = [
    { item: 'BMW' },
    { item: 'Toyota' },
    { item: 'Mitsubishi' },
    { item: 'Daihatsu' },
    { item: 'Hummer' },
    { item: 'Mercedes' },
    { item: 'Honda' }
  ]
  const [manufacturer, setManufacturer] = useState({ item: 'Select' })

  const passengerLists = [
    { item: 2 },
    { item: 3 },
    { item: 5 },
    { item: 8 },
    { item: 10 },
  ]
  const [passenger, setPassenger] = useState({ item: 'Select' })

  const showsLists = [
    { item: 4 },
    { item: 8 },
    { item: 16 },
  ]
  const [shows, setShows] = useState({ item: 'Select' })

  const sortLists = [
    { item: 'ASC' },
    { item: 'DESC' }
  ]
  const [sort, setSort] = useState({ item: 'Select' })
  const [minprice, setMinprice] = useState(0)
  const [maxprice, setMaxprice] = useState(0)

  const handleOnChangePrice = field => event => {
    field === 'min'? setMinprice(event.target.value) : setMaxprice(event.target.value)
  }

  const applyQuery = () => {
    let tempQuery = ''
    if (manufacturer.item !== 'Select') tempQuery += `&manufac=${manufacturer.item}`
    if (passenger.item !== 'Select') tempQuery += `&pssngr=${passenger.item}`
    if (shows.item !== 'Select') tempQuery += `&limit=${shows.item}`
    if (minprice) tempQuery += `&minprice=${minprice}`
    if (maxprice) tempQuery += `&minprice=${maxprice}`
    if (sort.item !== 'Select') tempQuery += `&sort=${sort.item}`
    if (tempQuery) setQuery(tempQuery)
  }

  const clearQuery = () => {
    setManufacturer({ item: 'Select'})
    setPassenger({ item: 'Select'})
    setShows({ item: 'Select'})
    if (query) setQuery()
  }

  const selectorWidget = (type, setted) => (
    <div className="">
      <Listbox value={type} onChange={type === manufacturerLists ? setManufacturer : type === passengerLists ? setPassenger : type === showsLists? setShows : setSort}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button className="relative w-full py-1 pl-3 pr-6 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{setted.item}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-red-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options static className="absolute w-auto z-20 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {type.map((component, itemIdx) => (
                    <Listbox.Option
                      key={itemIdx}
                      className={({ active }) =>
                        `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4 hover:bg-blue-200`
                      }
                      value={component}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${selected ? 'font-medium' : 'font-normal'
                              } block truncate`}
                          >
                            {component.item}
                          </span>
                          {selected ? (
                            <span
                              className={`${active ? 'text-amber-600' : 'text-amber-600'
                                }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )

  return (
    <div className="bg-gray-100">
      <div className="relative min-h-screen px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="absolute inset-x-0 top-0 items-center justify-center hidden overflow-hidden md:flex md:inset-y-0">
          <svg
            viewBox="0 0 88 88"
            className="w-full max-w-screen-xl text-red-300"
          >
            <circle fill="currentColor" cx="44" cy="44" r="15.5" />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="44"
            />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="37.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="29.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="22.5"
            />
          </svg>
        </div>
        <div className="mt-10 flex">
          <div className="z-10">Manufacturer:</div>
          <div className="ml-3 h-5v z-50 w-28">{selectorWidget(manufacturerLists, manufacturer)}</div>
          <div className="ml-5 z-10">Passenger:</div>
          <div className="ml-3 h-5v z-50 w-20">{selectorWidget(passengerLists, passenger)}</div>
          <div className="ml-5 z-10">Shows:</div>
          <div className="ml-3 h-5v z-50 w-20">{selectorWidget(showsLists, shows)}</div>
          <div className="ml-5 z-10">Price:</div>
          <button className="ml-5 z-10 bg-white py-1 px-2 h-7v -mt-2 text-red-700 rounded-xl border-2 font-semibold border-red-700 focus:outline-none" onClick={applyQuery}>Apply</button>
          <button className="ml-5 z-10 bg-red-700 py-1 px-2 h-7v -mt-2 text-white rounded-xl font-semibold focus:outline-none" onClick={clearQuery}>Clear filter</button>
        </div>
        <div className="container mx-auto bg-gray-100 mt-5 flex flex-wrap justify-center gap-5">
          {
            error ?
              <div className="z-40">
                <img src={searcherror} className="w-80" onLoad={() => setShowsorry(true)}/>
                <div className={showsorry? "text-center text-lg text-gray-500 font-bold" : "hidden"}>{error && error.data.message}</div>
              </div>
              :
              loading ?
                runCallback(() => {
                  const row = []
                  for (let i = 0; i < 8; i++) {
                    row.push(
                      <LoadingCarCards key={i}></LoadingCarCards>
                    )
                  }
                  return row
                })
                :
                cars.rows.length > 0 ?
                  cars.rows.map((car, index) => (
                    <Carcards car={car} key={index} loading={loading}></Carcards>
                  ))
                  :
                  <div className="z-40">
                    <img src={search1} className="max-w-sm" onLoad={() => setShowsorry(true)} />
                    <div className={showsorry? "text-center max-w-md text-gray-600" : "hidden"}>Sorry. It looks like we have no available car with this type. Contact us for more information.</div>
                  </div>
          }
        </div>
      </div>
    </div>
  )
}