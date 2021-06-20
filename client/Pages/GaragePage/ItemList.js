import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LiteCards from '../../Components/LiteCards'
import { cartCheckoutActions, cartListActions, cartSummaryActions } from '../../Redux/Actions/CartActions'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import { Transition, Listbox, Dialog } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'

const cities = [
  { name: 'Jakarta' },
  { name: 'Bogor' },
  { name: 'Depok' },
  { name: 'Tangerang' },
  { name: 'Bekasi' },
  { name: 'Bandung' }
]

export default function ItemList() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const history = useHistory()

  const dispatch = useDispatch()
  const [waiting, setWaiting] = useState(true)
  const [items, setItems] = useState([])
  const [cartid, setCartid] = useState()

  const [openform, setOpenform] = useState(false)
  const [selectedCity, setSelectedcity] = useState('Select city')
  const [orderdata, setOrderdata] = useState({
    order_phone: '',
    order_address: ''
  })
  const [formerror, setFormerror] = useState({
    phone: '',
    city: '',
    address: ''
  })
  const [checkouterror, setCheckouterror] = useState('') 

  const itemincart = useSelector(state => state.cart)

  useEffect(() => {
    dispatch(cartSummaryActions(cartid)).then((result) => {})
  }, [waiting, itemincart, cartid, items])
  const summary = useSelector(state => state.cartsum)
  const { loading, cartsum } = summary

  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  const [ordersummary, setOrdersummary] = useState({
    total_car: 0,
    total_days: 0,
    total_due: 0,
    total_discount: 0,
  })
  const [tax, setTax] = useState(0)
  useEffect(() => {
    const counttax = (ordersummary.total_due - ordersummary.total_discount) * 0.1
    setTax(counttax)
  })

  useEffect(() => {
    const { cart_id, line_items } = itemincart
    line_items ? setItems(line_items) : null
    if (cart_id) setCartid(cart_id)
    setWaiting(false)
  }, [summary, waiting, itemincart, items, cartid, cartsum])

  useEffect(() => {
    cartsum && !loading ? setOrdersummary(cartsum) : ''
  }, [summary, waiting, itemincart, items, cartid, cartsum])

  const formOnChange = field => event => {
    setOrderdata({ ...orderdata, [field]: event.target.value })
  }

  const placeOrder = () => {
    if (validateForm()) {
      const senddata = {
        lite_status: 'checkout',
        order_city: selectedCity,
        order_address: orderdata.order_address,
        order_phone: orderdata.order_phone
      }
      dispatch(cartCheckoutActions(cartid, senddata)).then((result) => {
        console.log(result.data)
        if (result.data.status === 201) {
          dispatch(cartListActions(result.data.data.order_user_id)).then((res) => {
            console.log('res', res)
            history.push({
              pathname: '/order/result',
              data: { items, ordersummary, order: result.data.data, orderdata, selectedCity }
            })
          })
        }
        else{
          dispatch(cartListActions(result.data.data.order_user_id))
          setOpenform(false)
          setCheckouterror('One or more car is not available. Please edit Your cart.')
        }
      })
    }
  }

  const validateForm = () => {
    let validated = true
    let err = {}

    if (!orderdata.order_phone || !orderdata.phone.match("[+][0-9]{10}")) {
      validated = false
      err.phone = 'Pone number has wrong format'
    }

    if (selectedCity === 'Select city') {
      validated = false
      err.city = 'You have to select a city'
    }

    if (!orderdata.order_address) {
      validated = false
      err.address = 'Address should not be empty'
    }

    setFormerror(err)
    return validated
  }

  return (
    <div className="bg-gray-200 h-100v">
      <div className="absolute text-white mt-28 w-screen z-30">
        <div className={checkouterror? 'bg-red-600 max-w-sm mx-auto py-3 px-3 rounded-full text-center' : ''}>{checkouterror}</div>
      </div>
      <div className="relative py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:py-20 px-12">
        <div className="mx-auto py-10">
          <div className="text-2xl font-semibold mb-4 flex">My Garage</div>
          <div className="flex flex-wrap">
            <div className="lg:w-5/6">
              {
                waiting ?
                  <div>Waiting</div>
                  :
                  ordersummary.total_car > 0 ?
                    items.map((item, index) => (
                      <LiteCards item={item} key={index} />
                    ))
                    :
                    <div>There is no car in your garage</div>
              }
            </div>
            <div className={ordersummary.total_car > 0 ? 'fixed right-48 bg-white backdrop-filter w-72 h-64v backdrop-blur-sm bg-opacity-10 rounded-3xl p-2 shadow-lg' : 'hidden'}>
              <div className="text-center text-black text-lg mb-3">Order Summary</div>
              <div className="border-red-500 border-b-4 mb-4"></div>
              <div className="mb-1 flex">
                <div className="w-1/2">Total cars</div>
                <div className="mr-1">:</div>
                <div>{ordersummary.total_car}</div>
              </div>
              <div className="mb-1 flex">
                <div className="w-1/2">Total days</div>
                <div className="mr-1">:</div>
                <div>{ordersummary.total_days}</div>
              </div>
              <div className="mb-1 flex">
                <div className="w-1/2">Subtotal</div>
                <div className="mr-1">:</div>
                <div>Rp{ordersummary.total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              </div>
              <div className="mb-1 flex">
                <div className="w-1/2">Discount</div>
                <div className="mr-1">:</div>
                <div>Rp{ordersummary.total_discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              </div>
              <div className="mb-1 flex">
                <div className="w-1/2">Tax</div>
                <div className="mr-1">:</div>
                <div>Rp{tax.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              </div>
              <div className="mb-1 flex">
                <div className="w-1/2">Total Payment</div>
                <div className="mr-1">:</div>
                <div>Rp{(ordersummary.total_due - ordersummary.total_discount + tax).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
              </div>
              <div className={`font-bold text-lg text-center`}>
                <button onClick={() => setOpenform(true)}
                  className="bg-red-500 rounded-xl px-3 py-2 mt-8 w-64 text-white focus:outline-none active:bg-red-700">
                  Order Now.
                </button>

              </div>
              <div className="text-xs ml-3 flex text-gray-500 mt-5">
                <div className="mr-1 text-sm font-bold">*</div>
                <div>By order our car, You are agree to our terms and condition, included your submitted personal information.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={openform} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 pb-10"
          onClose={() => setOpenform(false)}
          open={openform}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full h-80v max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-blue-500"
                >
                  Checkout
                </Dialog.Title>
                <div className="my-2">
                  <p className="text-sm text-gray-500">
                    Fulfill this form to complete your order
                  </p>
                </div>
                <div className="mb-2 flex w-full">
                  <div>Phone number</div>
                  <div className="text-red-600 text-sm mt-1 ml-2">{formerror.phone}</div>
                </div>
                <input type="tel" autoFocus={true} placeholder="+6281234567890" onChange={formOnChange('order_phone')}
                  className={`${formerror.phone? 'bg-red-500 text-black' : 'bg-blue-100 hover:bg-red-200 focus:bg-red-200'} block w-full border-none h-11 rounded-xl shadow-lg focus:ring-0`} />
                <div className="mt-4 mb-2 flex">
                  <div>City</div>
                  <div className="text-red-600 text-sm mt-1 ml-4">{formerror.city}</div>
                </div>
                <Listbox value={selectedCity} onChange={setSelectedcity}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-blue-100 rounded-lg focus:bg-red-200 shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="block truncate">{selectedCity}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-y-auto text-base bg-white rounded-md shadow-lg max-h-48 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {cities.map((city, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                            }
                            value={city.name}
                          >
                            {({ selectedCity, active }) => (
                              <>
                                <span
                                  className={`${selectedCity ? 'font-medium' : 'font-normal'
                                    } block truncate`}
                                >
                                  {city.name}
                                </span>
                                {selectedCity ? (
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
                </Listbox>
                <div className="mt-4 mb-2 flex">
                  <div>Address</div>
                  <div className="text-red-600 text-sm mt-1 ml-2">{formerror.address}</div>
                </div>
                <textarea  placeholder="Full address" maxLength={450} rows={5} onChange={formOnChange('order_address')}
                  className={`${formerror.address? 'bg-red-500' : 'bg-blue-100 hover:bg-red-200 focus:bg-red-200'} block w-full border-none rounded-xl shadow-lg focus:ring-0`}
                />
                  <button
                    className="inline-flex mt-4 mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>
                
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}