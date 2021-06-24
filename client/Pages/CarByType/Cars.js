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
    { item: 'Chevrolet' },
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
    { item: 3 },
    { item: 6 },
    { item: 9 },
  ]
  const [shows, setShows] = useState({ item: 'Select' })

  const sortByLists = [
    { item: 'Price' },
    { item: 'Rating' }
  ]
  const [sortby, setSortby] = useState({ item: 'Select' })

  const sortLists = [
    { item: 'ASC' },
    { item: 'DESC' }
  ]
  const [sort, setSort] = useState(sortLists[0])

  const [minprice, setMinprice] = useState()
  const [maxprice, setMaxprice] = useState()

  const ChangeMin = event => {
    if (!isNaN(event.target.value)) setMinprice(event.target.value)
  }

  const ChangeMax = event => {
    if (!isNaN(event.target.value)) setMaxprice(event.target.value)
  }

  const [searchword, setSearchWord] = useState('')
  const ChangeSearch = event => {
    setSearchWord(event.target.value)
  }

  const applyQuery = () => {
    let tempQuery = ''
    if (manufacturer.item !== 'Select') tempQuery += `&manufac=${manufacturer.item}`
    if (passenger.item !== 'Select') tempQuery += `&pssngr=${passenger.item}`
    if (shows.item !== 'Select') tempQuery += `&limit=${shows.item}`
    if (minprice) tempQuery += `&minprice=${minprice}`
    if (maxprice) tempQuery += `&maxprice=${maxprice}`
    if (sort.item !== 'Select') tempQuery += `&sort=${sort.item}`
    if (sortby.item !== 'Select') tempQuery += `&order=car_${sortby.item.toLocaleLowerCase()}`
    if (searchword) tempQuery += `&search=${searchword}`
    if (tempQuery) setQuery(tempQuery)
  }

  const clearQuery = () => {
    setManufacturer({ item: 'Select' })
    setPassenger({ item: 'Select' })
    setShows({ item: 'Select' })
    setMinprice()
    setMaxprice()
    setSort(sortLists[0])
    setSortby({ item: 'Select' })
    setSearchWord('')
    if (query) setQuery()
  }

  const movePage = (slctPage) => {
    let tempQuery = ''
    if (manufacturer.item !== 'Select') tempQuery += `&manufac=${manufacturer.item}`
    if (passenger.item !== 'Select') tempQuery += `&pssngr=${passenger.item}`
    if (shows.item !== 'Select') tempQuery += `&limit=${shows.item}`
    if (minprice) tempQuery += `&minprice=${minprice}`
    if (maxprice) tempQuery += `&maxprice=${maxprice}`
    if (sort.item !== 'Select') tempQuery += `&sort=${sort.item}`
    if (sortby.item !== 'Select') tempQuery += `&order=car_${sortby.item.toLocaleLowerCase()}`
    if (searchword) tempQuery += `&search=${searchword}`
    tempQuery += `&page=${slctPage}`
    console.log('query:', tempQuery)
    setQuery(tempQuery)
  }

  const selectorWidget = (type, setted) => (
    <div className="">
      <Listbox value={type} onChange={type === manufacturerLists ? setManufacturer : type === passengerLists ? setPassenger : type === sortByLists ? setSortby : type === sortLists ? setSort : type === showsLists ? setShows : setSort}>
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
                <Listbox.Options static className={`${open ? 'z-50' : ''} absolute w-auto py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
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
      <div className="relative min-h-screen px-4 py-20">
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
        <div className="flex justify-start">
          <div>
            {loading ? '' : cars.rows.length > 0 ? <div className="text-blue-700 mt-10">Page {cars.page} of {cars.pages}</div> : ''}
            {
              loading ?
                ''
                :
                cars.rows.length > 0 ?
                  <div className="mt-5">
                    <div className="flex">
                      <input type="text" className="h-5v focus:outline-none focus:ring-0 focus:ring-transparent border border-red-500 w-full z-20" placeholder="Search here" value={searchword} onChange={ChangeSearch} />
                    </div>
                    <div className="flex mt-3">
                      <div className="z-10">Manufacturer</div>
                      <div className="ml-1">:</div>
                      <div className="ml-2 h-5v w-28">{selectorWidget(manufacturerLists, manufacturer)}</div>
                    </div>
                    <div className="flex mt-3">
                      <div className="z-20">Passenger</div>
                      <div className="ml-7">:</div>
                      <div className="ml-2 h-5v w-20">{selectorWidget(passengerLists, passenger)}</div>
                    </div>
                    <div className="flex mt-3">
                      <div className="z-20">Shows</div>
                      <div className="ml-14">:</div>
                      <div className="ml-2 h-5v w-20">{selectorWidget(showsLists, shows)}</div>
                    </div>
                    <div className="flex mt-3">
                      <div className="z-20">Price</div>
                      <div className="ml-10 mr-2">:</div>
                      <input type="text" className="ml-1 -mt-1 w-24 z-40 h-5v focus:ring-0" placeholder="Minimum" value={minprice} onChange={ChangeMin} />
                      <input type="text" className="ml-1 -mt-1 w-24 z-40 h-5v focus:ring-0" placeholder="Maximum" value={maxprice} onChange={ChangeMax} />
                    </div>
                    <div className="flex mt-3">
                      <div className="z-20">Sort by</div>
                      <div className="ml-6">:</div>
                      <div className="ml-2 h-5v w-20">{selectorWidget(sortByLists, sortby)}</div>
                      <div className="ml-1 h-5v w-20">{selectorWidget(sortLists, sort)}</div>
                    </div>
                    <div className="flex mt-3">
                      <button className="ml-5 z-30 bg-white py-1 px-2 h-7 text-red-700 rounded-xl border-2 font-semibold border-red-700 focus:outline-none" onClick={applyQuery}>Apply</button>
                      <button className="ml-5 z-30 bg-red-700 py-1 px-2 h-7v text-white rounded-xl font-semibold focus:outline-none" onClick={clearQuery}>Clear filter</button>
                    </div>
                  </div>
                  :
                  ''
            }
          </div>
          <div>
            <div className="mx-auto ml-10 bg-gray-100 mt-5 flex flex-wrap justify-start gap-10">
              {
                error ?
                  <div className="z-40">
                    <img src={searcherror} className="w-80" onLoad={() => setShowsorry(true)} />
                    <div className={showsorry ? "text-center text-lg text-gray-500 font-bold" : "hidden"}>{error && error.data.message}</div>
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
                      <div className="ml-96 z-40">
                        <img src={search1} className="max-w-sm ml-4" onLoad={() => setShowsorry(true)} />
                        <div className={showsorry ? "text-center max-w-md ml-5 text-gray-600" : "hidden"}>Sorry. It looks like we have no available car with this type. Contact us for more information.</div>
                      </div>
              }
            </div>
            {
              loading ?
                ''
                :
                cars.rows.length > 0 ?
                  <div class="flex justify-center mt-10 space-x-1">
                    <button onClick={() => { cars.page > 1 ? movePage(cars.page - 1) : null }}
                      class={`${cars.page > 1 ? 'text-indigo-600 hover:bg-blue-200' : 'text-gray-400'} flex items-center justify-center h-8 w-8 rounded focus:outline-none z-20`}
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" disabled={cars.page === 1}>
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => { cars.page > 1 ? movePage(cars.page - 1) : null }}
                      class={`${cars.page > 1 ? 'text-indigo-600 hover:bg-blue-200' : 'text-gray-400'} flex items-center justify-center h-8 px-2 rounded text-sm font-medium focus:outline-none z-20`} disabled={cars.page === 1}
                    >
                      Prev
                    </button>
                    {

                      runCallback(() => {
                        const row = []
                        for (let i = 0; i < cars.pages; i++) {
                          row.push(
                            <button onClick={() => movePage(i + 1)}
                              class={`${cars.page == (i + 1) ? 'bg-blue-200' : ''} flex items-center justify-center h-8 w-8 rounded text-sm font-medium text-indigo-600 hover:bg-blue-200 focus:outline-none z-20`}
                            >
                              {i + 1}
                            </button>
                          )
                        }
                        return row
                      })
                    }
                    <button onClick={() => { cars.page < cars.pages ? movePage(parseInt(cars.page) + 1) : null }}
                      class={`${cars.page < cars.pages ? 'text-indigo-600 hover:bg-blue-200' : 'text-gray-400'} flex items-center justify-center h-8 px-2 rounded text-sm font-medium focus:outline-none z-20`}
                    >
                      Next
                    </button>
                    <button onClick={() => { cars.page < cars.pages ? movePage(parseInt(cars.page) + 1) : null }}
                      class={`${cars.page < cars.pages ? 'text-indigo-600 hover:bg-blue-200' : 'text-gray-400'} flex items-center justify-center h-8 w-8 rounded focus:outline-none z-20`}
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  :
                  ''
            }
          </div>
        </div>
      </div>
    </div>
  )
}