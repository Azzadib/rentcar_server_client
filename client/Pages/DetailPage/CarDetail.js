import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import star from '../../assets/svg/star.svg'
import { carDetailActions } from '../../Redux/Actions/CarActions'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import Caim from '../../SericeApis/Caim'
import { addLiteActions } from '../../Redux/Actions/LiteActions'
import { cartListActions } from '../../Redux/Actions/CartActions'
import { Link } from 'react-router-dom'
import noImg from '../../assets/images/no-image.jpg'
import DatePicker from 'react-datepicker'
import { addDays, addMonths, formatDistanceStrict, parseISO } from 'date-fns'

export default function CarDetail() {
  const { id } = useParams()

  const [images, setImages] = useState([])
  const [mainimages, setMainimages] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [logedin, setLogedin] = useState(false)
  const [asktologin, setAsktologin] = useState(false)
  const [userdetail, setUserdetail] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [days, setDays] = useState(1)

  const [startDate, setStartDate] = useState(addDays(new Date(), 1));
  const [endDate, setEndDate] = useState(addDays(new Date(), 1))

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(carDetailActions(id))
  }, [id])

  const userdata = useSelector(state => state.login)
  useEffect(() => {
    if (userdata) {
      const { user } = userdata
      if (user) setLogedin(true)
      if (user.user_type === 'Admin') setIsAdmin(true)
      setUserdetail(user)
    }
  }, [dispatch])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  const carData = useSelector((state) => state.carDetail)
  const { loading, error, car } = carData
  const [ondesc, setOndesc] = useState(true)

  const runCallback = (cb) => {
    return cb()
  }

  useEffect(() => {
    if (loading !== true && car.car_images.length > 0 && loaded === false) {
      car.car_images.map((image) => {
        Caim.download(car.car_number, image.caim_filename).then(result => {
          if (image.caim_primary) setMainimages({ img: URL.createObjectURL(result) })
          setImages(images => [...images, { img: URL.createObjectURL(result) }])
        })
      })
      setLoaded(true)
    }
  }, [car])

  useEffect(() => {
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    if (endDate < startDate) setEndDate(startDate)
    const newDays = parseInt(formatDistanceStrict(startDate, addDays(endDate, 1)).split(' ')[0])
    setDays(newDays)
  }, [startDate, endDate])

  const addToGarae = (action) => {
    const uid = userdetail.user_id
    const carnum = car.car_number
    const lite_days = {
      lite_days: days,
      lite_start: startDate,
      lite_end: endDate
    }
    dispatch(addLiteActions(uid, carnum, lite_days)).then((res) => {
      if (res.data.status === 201) {
        dispatch(cartListActions(uid)).then((result) => {
          if (result.data.status === 200) action === 'checkout' ? window.location = '/garage' : window.location.reload()
        })
      }
      else {
        console.log(`add cart response status: ${res.data.status}`)
        console.log(`add cart message: ${res.data.data.message}`)
      }
    })
  }

  const details = () => (
    <div className="text-black">
      <div>Type:<span className="font-semibold ml-2">{loading ? 'Type' : `${car.car_type[0].toUpperCase()}${car.car_type.substring(1)}`}</span></div>
      <div>Door:<span className="font-semibold ml-2">{loading ? 0 : `${car.car_door} doors`}</span></div>
      <div>Passenger:<span className="font-semibold ml-2">{loading ? 0 : `${car.car_passenger} passengers`}</span></div>
      <div>Facilities:{loading ? 'Facilities' : <span className="font-semibold ml-2">{`${car.car_ac ? 'Ac' : ''}${car.car_ac && car.car_baggage ? ' and ' : ''}${car.car_baggage ? 'Baggage' : ''}`}</span>}</div>
      <p className="text-justify mt-2 px-1">{loading ? '' : `${car.car_description}`}</p>
    </div>
  )

  const reviews = () => (
    <div>
      {
        car.car_comments.length > 0 ?
          car.car_comments.map((comment) => (
            <div className="bg-white w-88 mb-3 p-2 shadow-md">
              <div className="flex">
                <img src={noImg} className="w-12 rounded-full object-cover overflow-hidden" />
                <div className="mx-2 my-auto">
                  <div>User id: {comment.carco_user_id}</div>
                  <div className="flex">
                    {
                      runCallback(() => {
                        const row = []
                        for (let i = 0; i < comment.carco_rating; i++) {
                          row.push(
                            <img src={star} className="mr-2 w-5" />
                          )
                        }
                        return row
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="ml-14">{comment.carco_comment ? comment.carco_comment : ''}</div>
            </div>
          ))
          :
          <div>There is no review for this car.</div>
      }
    </div>
  )

  return (
    <div className="bg-gray-200">
      <div className="relative min-h-screen px-2 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-4 lg:py-20">
        <div className="container mx-auto py-10 flex flex-wrap gap-5">
          <div className="flex flex-wrap z-40 w-screen">
            <div className="fixed">
              <img src={mainimages.img ? mainimages.img : images[0] ? images[0].img : noImg}
                className="mb-3 w-96 h-50v border-red-500 border-2 object-cover overflow-hidden"
                onError={(e) => { e.target.onerror = null; e.target.src = { noImg } }}
              />
              <div className="flex flex-wrap">
                {
                  images && images.length > 0 ?
                    images.map((image, index) => (
                      <img src={image.img} key={index}
                        onClick={() => setMainimages({ img: image.img })}
                        className="w-20 h-10v mr-5 mb-2 border-red-500 border-2 overflow-hidden object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = { noImg } }}
                      />
                    ))
                    :
                    ''
                }
              </div>
            </div>
            <div className="w-1/3"></div>
            <div className="">
              <div className="flex mb-3">
                <div className="text-left uppercase text-xl font-bold">
                  {loading ? `Manufacturer Model` : `${car.car_manufacturer} ${car.car_model}`}
                </div>
                <Link to={{ pathname: `/admin/editcar/${id}`, }}>
                  <button
                    className={isAdmin ? "ml-8 border border-red-500 bg-white rounded-xl font-bold text-red-500 px-2 focus:outline-none active:transform active:scale-125" : 'hidden'}
                  >
                    Edit car
                  </button>
                </Link>
              </div>
              <div className="flex mb-3">
                <div>{loading ? 0 : car.car_comments.length}</div>
                <div className="ml-2 mr-4">reviews</div>
                <img src={star} className="w-4" />
                <div className="ml-2">
                  {loading ? 0 : car.car_rating}
                </div>
              </div>
              <div className="mb-3 font-bold text-2xl">Rp{loading ? 0 : car.car_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              <div className="w-96 flex border-b-2 border-red-500">
                <button onClick={() => setOndesc(true)} className={`${ondesc ? 'bg-red-500 text-white font-semibold' : ''} mr-4 focus:outline-none px-2`}>Details</button>
                <button onClick={() => setOndesc(false)} className={`${ondesc ? '' : 'bg-red-500 text-white font-semibold'} mr-4 focus:outline-none px-2`}>Reviews</button>
              </div>
              <div className="mt-2 max-w-lg">
                {ondesc ? details() : reviews()}
              </div>
            </div>
            <div className='fixed right-16 bg-white ml-10 backdrop-filter w-72 h-72v backdrop-blur-sm bg-opacity-10 rounded-3xl p-2 shadow-lg'>
              <div className="text-center text-black text-lg mb-3">Add this car to your garage</div>
              <div className="border-red-500 border-b-4"></div>
              <div className="mt-1 ml-2">Duration: {formatDistanceStrict(startDate, addDays(endDate, 1))}</div>
              <div className="mt-2 flex">
                <div className=" ml-2 my-auto">From:</div>
                <DatePicker
                  className="h-5v w-28 ml-6 bg-blue-500 text-white my-auto"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={addDays(new Date(), 1)}
                  maxDate={addMonths(new Date(), 1)}
                  showDisabledMonthNavigation
                />
              </div>
              <div className="ml-2 mt-2 flex">
                <div className="my-auto">Until:</div>
                <DatePicker
                  className="h-5v w-28 bg-red-500 text-white ml-7"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  highlightDates={[startDate]}
                  maxDate={addDays(startDate, 13)}
                  showDisabledMonthNavigation
                />
              </div>
              <div className="text-gray-500 mt-3 ml-2 mb-5">Maximum: 14 days.</div>
              <div className={`${days > 2 ? 'text-gray-500' : 'hidden'} text-lg ml-32 font-medium`}>RP<del>{loading ? 0 : (car.car_price * days).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</del></div>
              <div className="flex">
                <div className="text-gray-600">Subtotal</div>
                <div className="ml-16 text-xl font-bold">Rp{loading ? 0 : (days > 2 ? car.car_price * days * 0.85 : car.car_price * days).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              </div>
              <div className={`${days > 2 ? 'hidden' : ''} text-sm text-gray-500`}>Get 15% discount for each car ordered more than 2 days.</div>
              <div className={`${days > 2 ? 'mt-7' : 'mt-4'} font-bold text-lg text-center`}>
                <button onClick={() => { logedin ? car.car_user_id? '' : addToGarae('add') : setAsktologin(true) }}
                  className={`${car? ((car.car_user_id !== null) && logedin)? 'hover:cursor-not-allowed' : '' : ''} bg-red-500 rounded-xl px-3 py-2 w-64 text-white focus:outline-none active:bg-red-700`}>
                  {asktologin ? 'Login First.' : 'Add to Garage'}
                </button>
                <button onClick={() => { logedin ? car.car_user_id? '' : addToGarae('checkout') : setAsktologin(true) }}
                  className={`${car? ((car.car_user_id !== null) && logedin)? 'hover:cursor-not-allowed' : '' : ''} bg-white border-red-500 border-2 mt-3 rounded-xl px-3 py-2 w-64 text-red-500 focus:outline-none `}>
                  {asktologin ? 'Login First.' : 'Checkout now.'}
                </button>
              </div>
              <div className="text-xs ml-3 flex text-gray-500 mt-1">
                <div className="mr-1 text-sm font-bold">*</div>
                <div>Tax would be applied to above price when checkout.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}