import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { carByTypeActions } from '../../Redux/Actions/CarActions'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import { useParams } from 'react-router-dom'
import Carcards from '../../Components/CarCards'
import LoadingCarCards from '../../Components/Loadingcarcards'
import search1 from '../../assets/images/search1.png'
import searcherror from '../../assets/svg/search-error.svg'

export default function Cars() {
  const { type } = useParams()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(carByTypeActions(type))
  }, [dispatch])

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
        <div className="container mx-auto bg-gray-100 py-10 flex flex-wrap justify-center gap-5">
          {
            error ?
              <div className="z-40">
                <img src={searcherror} className="w-80" />
                <div className="text-center text-lg text-gray-500 font-bold">{error && error.data.message}</div>
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
                cars.length > 0 ?
                  cars.map((car, index) => (
                    <Carcards car={car} key={index} loading={loading}></Carcards>
                  ))
                  :
                  <div className="z-40">
                    <img src={search1} className="max-w-sm" />
                    <div className="text-center max-w-md text-gray-600">Sorry. It looks like we have no available car with this type. Contact us for more information.</div>
                  </div>
          }
        </div>
      </div>
    </div>
  )
}