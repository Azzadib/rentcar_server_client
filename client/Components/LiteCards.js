import React, { useState } from 'react'
import { useEffect } from 'react'
import Car from '../SericeApis/Car'
import plus from '../assets/svg/plus.svg'
import minus from '../assets/svg/minus.svg'
import deleteIcon from '../assets/svg/delete-icon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { deleteLiteActions, editLiteActions } from '../Redux/Actions/LiteActions'
import { cartListActions } from '../Redux/Actions/CartActions'
import DatePicker from 'react-datepicker'
import { addDays, addMonths, formatDistanceStrict, parseISO } from 'date-fns'

export default function LiteCards(props) {
  const { item } = props
  const [lite, setLite] = useState({
    lite_user_id: '',
    lite_price: 0,
    lite_discount: 0,
    lite_days: 0,
  })
  const [changes, setChanges] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [car, setCar] = useState()
  const [startDate, setStart] = useState(new Date())
  const [endDate, setEnd] = useState(new Date())
  const [days, setDays] = useState(0)
  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.login)

  useEffect(() => {
    if (item) {
      setLite(item)
      setDays(item.lite_days)
      setStart(parseISO(item.lite_start))
      setEnd(parseISO(item.lite_end))
    }
  }, [])

  useEffect(() => {
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    if (endDate < startDate) setEnd(startDate)
    const newDays = parseInt(formatDistanceStrict(startDate, addDays(endDate, 1)).split(' ')[0])
    setDays(newDays)
    setChanges(true)
  }, [startDate, endDate])

  useEffect(() => {
    Car.getCar(item.lite_car_id).then((cardata) => {
      setCar(cardata)
    }).catch(err => {
      console.log(`Error : ${err}`)
    })
  }, [])

  const editItem = () => {
    dispatch(editLiteActions(lite.lite_id, { lite_start: startDate, lite_end: endDate })).then((result) => {
      console.log('result', result)
      if (result.data.status === 201) {
        dispatch(cartListActions(userinfo.user.user_id)).then((res) => {
          console.log('result', res)
          item.lite_days = days
          setUpdated(true)
          setTimeout(() => { setUpdated(false) }, 1000)
        })
      }
    })
  }

  const deleteItem = () => {
    dispatch(deleteLiteActions(lite.lite_id)).then((result) => {
      console.log(result)
      dispatch(cartListActions(userinfo.user.user_id)).then((res) => {
        console.log(res)
        window.location.reload()
      })
    })
  }

  return (
    <div className="flex gap-3 bg-white mb-3 w-2/3 shadow-lg rounded-r-xl border-b-2 border-r-2 border-red-500">
      <div className={`${updated ? 'absolute' : 'hidden'} z-20`}>
        <div class="flex w-full ml-32 mt-8 max-w-sm overflow-hidde bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div class="flex items-center justify-center w-12 bg-green-500">
            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
            </svg>
          </div>
          <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
              <span class="font-semibold text-green-500 dark:text-green-400">Success</span>
              <p class="text-sm text-gray-600 dark:text-gray-200">Item updated successfully.</p>
            </div>
          </div>
          <div onClick={() => { setUpdated(false) }} className="font-bold text-red-600 text-xl hover:cursor-pointer w-32 pr-2 text-right">
            x
          </div>
        </div>
      </div>
      <img img src={car ? `http://localhost:3000/api/caim/cardata/${car.car_number}/${car.car_images.map((image) => { if (image.caim_primary === true) return image.caim_filename }).join('')}` : ''}
        onError={(e) => { e.target.onerror = null; e.target.src = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg" }}
        className="w-28 h-20v object-cover overflow-hidden" />
      <div className="ml-2 mt-2 mr-5 w-40">
        <div className="text-blue-700 font-medium">{car ? car.car_manufacturer : ''} {car ? car.car_model : ''}</div>
        <div className="mt-1">
          <div className={car? car.car_user_id !== null ? '' : 'hidden' : 'hidden' }>Not available</div>
          <div className={days > 2 ? 'mr-3 mt-3 text-gray-700' : 'hidden'}><del>Rp{changes && car ? (days * car.car_price).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : lite.lite_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</del></div>
          <div className="text-lg font-bold">Rp{changes && car ? days > 2 ? (days * car.car_price * 0.85).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : (days * car.car_price).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : (lite.lite_price - lite.lite_discount).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
        </div>
      </div>
      <div className="my-auto mr-3">
        <img src={deleteIcon} className="w-7 hover:cursor-pointer my-auto" onClick={deleteItem} />
      </div>
      <div className="my-auto">
        <div className="flex my-auto">
          <DatePicker
            className="h-5v w-28 bg-blue-500 text-white my-auto"
            selected={startDate}
            onChange={(date) => setStart(date)}
            minDate={addDays(new Date(), 1)}
            maxDate={addMonths(new Date(), 1)}
            showDisabledMonthNavigation
          />
          <div className="mx-1">to</div>
          <DatePicker
            className="h-5v w-28 bg-red-500 text-white"
            selected={endDate}
            onChange={(date) => setEnd(date)}
            minDate={startDate}
            maxDate={addDays(startDate, 13)}
            showDisabledMonthNavigation
          />
        </div>
        <button onClick={editItem}
          className={`${days == item.lite_days ? 'bg-gray-500 hover:cursor-not-allowed' : 'bg-green-500'} ml-10 border-2 mt-3 rounded-xl px-3 py-1 text-white focus:outline-none`}
        >
          Save changes.
        </button>
      </div>
    </div>
  )

}