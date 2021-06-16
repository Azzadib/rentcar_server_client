import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import star from '../assets/svg/star.svg'
import steeringwheel from '../assets/svg/steering-wheel.svg'
import { cartListActions } from '../Redux/Actions/CartActions'
import { addLiteActions } from '../Redux/Actions/LiteActions'

export default function Carcards(props) {
  const { car, loading } = props
  const [loadimg, setLoadimg] = useState(true)
  const [userdetail, setUserdetail] = useState()
  const [logedin, setLogedin] = useState(false)
  const [addtext, setAddtext] = useState('Add to garage')
  const dispatch = useDispatch()

  const [notavailable, setNotavailable] = useState(false)

  const userdata = useSelector(state => state.login)
  useEffect(() => {
    if (userdata) {
      const { user } = userdata
      if (user) setLogedin(true)
      setUserdetail(user)
      if (car.car_user_id && car.car_user_id !== user.user_id) setNotavailable(true)
    }
  }, [dispatch])

  const addToGarage = () => {
    const uid = userdetail.user_id
    const carnum = car.car_number
    const lite_days = { lite_days: 1}
    dispatch(addLiteActions(uid, carnum, lite_days)).then((res) => {
      if (res.data.status === 201) {
        dispatch(cartListActions(uid)).then((result) => {
          if (result.data.status === 200) window.location.reload()
        })
      }
      else {
        console.log(`add cart response status: ${res.data.status}`)
        console.log(`add cart message: ${res.data.data.message}`)
      }
    })
  }

  return (
    <div className="bg-white rounded-t-lg w-72 z-40 shadow-lg cursor-pointer rounded transform hover:transform hover:scale-105 hover:border-2 duration-300 ease-in-out hover:border-red-500">
      <div onClick={() => window.location=`/detail/${car.car_id}`}>
        <div className={`${car.car_rating >= 4 ? '' : 'hidden'} absolute mx-2 bg-yellow-400 rounded-3xl px-2 mt-2 text-white`}>
          Recommended
        </div>
        <div className="">
          <img src={steeringwheel} className={`${(loadimg || loading) ? '' : 'hidden'} w-20 absolute animate-spin top-20 left-24`} />
          <img src={`http://localhost:3000/api/caim/cardata/${car.car_number}/${car.car_images.map((image) => { if (image.caim_primary === true) return image.caim_filename }).join('')}`}
            alt={`${car.car_number}`}
            className="w-full rounded-t-lg h-40v overflow-hidden object-cover"
            onLoad={() => setLoadimg(false)}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg" }}
          />
        </div>
        <div className="px-2">
          <div className="text-md text-red-700 font-semibold">
            {car.car_manufacturer} {car.car_model}
          </div>
          <p className="text-sm text-gray-500 h-7v overflow-hidden">
            {car.car_description} {car.car_description} {car.car_description} {car.car_description}
          </p>
          <div className="grid grid-cols-2 mt-2">
            <div className="flex">
              <img src={star} className="w-4" />
              <div className="ml-2">
                {car.car_rating}
              </div>
            </div>
            <div className="text-gray-500 text-right">
              {car.car_comments.length} reviews
          </div>
          </div>
        </div>
      </div>
      <div className="mt-4 ml-3 mb-2 flex">
        <div className="font-bold text-blue-600">
          Rp{car.car_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
        </div>
        <button onClick={() => {logedin? notavailable? '' : addToGarage() : setAddtext('Login first.')}}
          className={`${notavailable? 'cursor-not-allowed bg-gray-300' : 'bg-red-500'} text-md font-semibold mx-auto text-white px-4 border-b-4 border-r-4 rounded-xl hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none active:mb-1 focus:outline-none`}>
          {addtext}
          </button>
      </div>
    </div>
  )
}