import { Dialog, Disclosure, Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/solid'
import ButtonBayar from '../../Components/ButtonBayar'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import cancelicon from '../../assets/svg/cancelled.svg'
import comingicon from '../../assets/svg/coming.svg'
import doneicon from '../../assets/svg/done.svg'
import activeicon from '../../assets/svg/active.svg'
import { allOrderActions, updateOrderActions } from '../../Redux/Actions/OrderActions'
import Order from '../../SericeApis/Order'
import { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { Box } from '@material-ui/core'

const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'OK',
  4: 'Good',
  5: 'Excellent',
}

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
})

export default function OrderList() {
  const dispatch = useDispatch()

  const [waitpymnt, setWaitpymnt] = useState([])
  const [slctd, setSlctd] = useState()
  const [actvord, setActvord] = useState([])
  const [comingsoon, setComingsoon] = useState([])
  const [finished, setFinisihed] = useState([])
  const [cancelled, setCancelled] = useState([])

  const [waiting, setWaiting] = useState(true)

  const [pymntres, setPymntres] = useState({})

  let orderlist = useSelector(state => state.allorder)
  useEffect(() => {
    setWaiting(true)
    if (orderlist.length > 0) {
      setWaitpymnt([])
      setActvord([])
      setComingsoon([])
      setFinisihed([])
      setCancelled([])

      orderlist.map((order) => {
        if (order.order_status == 'open') setWaitpymnt(waitpymnt => [...waitpymnt, order])
        else if (order.order_status == 'rent') setActvord(actvord => [...actvord, order])
        else if (order.order_status == 'paid') setComingsoon(comingsoon => [...comingsoon, order])
        else if (order.order_status == 'closed') setFinisihed(finished => [...finished, order])
        else if (order.order_status == 'cancelled') setCancelled(canceled => [...canceled, order])
      })
    }
    setWaiting(false)
  }, [orderlist])

  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  const history = useHistory()

  useEffect(() => {
    if (pymntres.payt_trx_number) {
      dispatch(updateOrderActions('paid', pymntres.payt_order_number, { 'pyt_num': pymntres.payt_trx_number })).then((result) => {
        if (result.data.status === 201) {
          dispatch(allOrderActions(result.data.data.order_user_id)).then((res) => {
            if (res.data.status == 200) history.push({
              pathname: '/order/result',
              data: { order: slctd }
            })
            else console.log(res.data)
          })
        }
        else console.log(`error ${result.data.status}`, result)
      })
    }
  }, [pymntres])

  const cancelOrder = (toCncl) => {
    if (toCncl.order_pay_trx_number) {
      const data = { payt_trx_number_ref: toCncl.order_pay_trx_number }
      Order.refund(data).then((r) => {
        console.log('cancel:', r)
      })
    }
    dispatch(updateOrderActions('cancelled', toCncl.order_name)).then((result) => {
      if (result.data.status === 201) {
        dispatch(allOrderActions(result.data.data.order_user_id)).then((res) => {
          if (res.data.status == 200) window.location.reload()
          else console.log(res.data)
        })
      }
      else console.log(`error ${result.data.status}`, result)
    })
  }

  const updateOrder = (toUpd, stat) => {
    dispatch(updateOrderActions(stat, toUpd.order_name)).then((result) => {
      if (result.data.status === 201) {
        dispatch(allOrderActions(result.data.data.order_user_id)).then((res) => {
          if (res.data.status == 200) window.location.reload()
          else console.log(res.data)
        })
      }
      else console.log(`error ${result.data.status}`, result)
    })
  }

  const [feedback, setFeedback] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  const writeReview = event => {
    setReview(event.target.value)
  }

  const sendReview = () => {
    setFeedback(false)
    console.log('rat', rating)
    console.log('rev', review)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="pt-28 pb-5">
        <div className="border-blue-600 border px-3 py-3 rounded-3xl">
          <div className="text-center font-semibold text-xl">My Order</div>
          <div className="mt-3">
            <Disclosure defaultOpen="true">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-red-300 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Waiting for payment ({waitpymnt.length})</span>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div>
                      {
                        waiting ?
                          ''
                          :
                          waitpymnt.length > 0 ?
                            waitpymnt.map((list) => (
                              <div className="mt-2 bg-blue-100 px-2 py-2 rounded-xl shadow-md flex" key={list.order_number}>
                                <div className="w-1/2">
                                  <div className="flex">
                                    <div>Order number {list.order_name}</div>
                                    <div className="ml-2 text-blue-500 underline hover:cursor-pointer"
                                      onClick={() => history.push({
                                        pathname: '/order/result',
                                        data: { order: list }
                                      })}
                                    >
                                      Invoice
                                    </div>
                                  </div>
                                  <div className="flex text-sm my-1">
                                    <div>Created on</div>
                                    <div className="mx-1">{(new Date(list.order_created_on)).toString().split(' GMT')[0]}</div>
                                  </div>
                                  <div className="font-bold text-lg">Total Payment <span className="text-red-500">Rp{list.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</span></div>
                                </div>
                                <button onClick={() => { if (window.confirm('Are you sure you wish to cancel this order?')) cancelOrder(list) }}
                                  className="my-auto border-2 border-red-500 bg-red-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                >
                                  Cancel
                                </button>
                                <div className="my-auto ml-5 w-56" onClick={() => setSlctd(list)}>
                                  <ButtonBayar onSuccess={setPymntres}
                                    amount={list.order_total_due} orderNumber={list.order_name}
                                  />
                                </div>
                              </div>
                            ))
                            :
                            <div className="text-indigo-500 text-center">You have no pending order</div>
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mt-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-red-300 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Coming Soon ({comingsoon.length})</span>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div>
                      {
                        waiting ?
                          ''
                          :
                          comingsoon.length > 0 ?
                            comingsoon.map((list) => (
                              <div className="mt-2 bg-blue-100 px-2 py-2 rounded-xl shadow-md flex" key={list.order_number}>
                                <img src={comingicon} className="w-16 ml-1 mr-5" />
                                <div>
                                  <div className="flex">
                                    <div>Order number {list.order_name}</div>
                                    <div className="ml-2 text-blue-500 underline hover:cursor-pointer"
                                      onClick={() => history.push({
                                        pathname: '/order/result',
                                        data: { order: list }
                                      })}
                                    >
                                      Invoice
                                    </div>
                                  </div>
                                  <div className="flex text-sm my-1">
                                    <div>Created on</div>
                                    <div className="mx-1">{(new Date(list.order_created_on)).toString().split(' GMT')[0]}</div>
                                  </div>
                                  <div className="font-bold text-lg">Total Payment <span className="text-red-500">Rp{list.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</span></div>
                                </div>
                                <button onClick={() => { if (window.confirm('Are you sure you wish to cancel this order?')) cancelOrder(list) }}
                                  className="my-auto ml-20 border-2 border-red-500 bg-red-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                >
                                  Cancel
                                </button>
                                <button onClick={() => updateOrder(list, 'rent')}
                                  className="my-auto ml-8 border-2 border-blue-500 bg-blue-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                >
                                  Start
                                </button>
                              </div>
                            ))
                            :
                            <div className="text-indigo-500 text-center">You have no coming order.</div>
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mt-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-red-300 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Active ({actvord.length})</span>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div>
                      {
                        waiting ?
                          ''
                          :
                          actvord.length > 0 ?
                            actvord.map((list) => (
                              <div className="mt-2 bg-blue-100 px-2 py-2 rounded-xl shadow-md flex" key={list.order_number}>
                                <img src={activeicon} className="w-16 ml-1 mr-5" />
                                <div>
                                  <div className="flex">
                                    <div>Order number {list.order_name}</div>
                                    <div className="ml-2 text-blue-500 underline hover:cursor-pointer"
                                      onClick={() => history.push({
                                        pathname: '/order/result',
                                        data: { order: list }
                                      })}
                                    >
                                      Invoice
                                    </div>
                                  </div>
                                  <div className="flex text-sm my-1">
                                    <div>Created on</div>
                                    <div className="mx-1">{(new Date(list.order_created_on)).toString().split(' GMT')[0]}</div>
                                  </div>
                                  <div className="font-bold text-lg">Total Payment <span className="text-red-500">Rp{list.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</span></div>
                                </div>
                                <button onClick={() => updateOrder(list, 'closed')}
                                  className="my-auto ml-10 border-2 border-blue-500 bg-blue-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                >
                                  Finish
                                </button>
                              </div>
                            ))
                            :
                            <div className="text-indigo-500 text-center">You have no active order.</div>
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mt-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-red-300 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Finished ({finished.length})</span>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div>
                      {
                        waiting ?
                          ''
                          :
                          finished.length > 0 ?
                            finished.map((list) => (
                              <div className="mt-2 bg-blue-100 px-2 py-2 rounded-xl shadow-md flex" key={list.order_number}>
                                <img src={doneicon} className="w-16 ml-1 mr-5" />
                                <div>
                                  <div className="flex">
                                    <div>Order number {list.order_name}</div>
                                    <div className="ml-2 text-blue-500 underline hover:cursor-pointer"
                                      onClick={() => history.push({
                                        pathname: '/order/result',
                                        data: { order: list }
                                      })}
                                    >
                                      Invoice
                                    </div>
                                  </div>
                                  <div className="flex text-sm my-1">
                                    <div>Created on</div>
                                    <div className="mx-1">{(new Date(list.order_created_on)).toString().split(' GMT')[0]}</div>
                                  </div>
                                  <div className="font-bold text-lg">Total Payment <span className="text-red-500">Rp{list.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</span></div>
                                </div>
                                <button
                                  className="my-auto ml-10 border-2 border-green-500 bg-green-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                  onClick={() => history.push({
                                    pathname: '/feedback',
                                    data: { order: list }
                                  })}
                                >
                                  Feedback
                                </button>
                              </div>
                            ))
                            :
                            <div className="text-indigo-500 text-center">You have no finished order.</div>
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mt-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-red-300 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Cancelled ({cancelled.length})</span>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div>
                      {
                        waiting ?
                          ''
                          :
                          cancelled.length > 0 ?
                            cancelled.map((list) => (
                              <div className="mt-2 bg-blue-100 px-2 py-2 rounded-xl shadow-md flex" key={list.order_number}>
                                <img src={cancelicon} className="w-16 ml-1 mr-5" />
                                <div>
                                  <div className="flex">
                                    <div>Order number {list.order_name}</div>
                                    <div className="ml-2 text-blue-500 underline hover:cursor-pointer"
                                      onClick={() => history.push({
                                        pathname: '/order/result',
                                        data: { order: list }
                                      })}
                                    >
                                      Invoice
                                    </div>
                                  </div>
                                  <div className="flex text-sm my-1">
                                    <div>Created on</div>
                                    <div className="mx-1">{(new Date(list.order_created_on)).toString().split(' GMT')[0]}</div>
                                  </div>
                                  <div className="font-bold text-lg">Total Payment <span className="text-red-500">Rp{list.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</span></div>
                                </div>
                                <div className="my-auto ml-8 font-semibold text-lg text-blue-500">{list.order_pay_trx_number ? `Payment number: ${list.order_pay_trx_number}` : ''}</div>
                              </div>
                            ))
                            :
                            <div className="text-indigo-500 text-center">You have no canceled order.</div>
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
      <Transition appear show={feedback} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 pb-10"
          onClose={() => setFeedback(false)}
          open={feedback}
        >
          <div className="px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <span
              className="inline-block align-middle"
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
              <div className="inline-block w-full h-64v max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-blue-500"
                >
                  Feedback
                </Dialog.Title>
                <div className="my-2">
                  <p className="text-sm text-gray-500">
                    Share your rent experience
                  </p>
                </div>
                <div className="mb-2 flex w-full">
                  <div>Rating</div>
                </div>
                <div className={classes.root}>
                  <Rating
                    name="hover-feedback"
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                  />
                  {rating !== null && <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>}
                </div>
                <div className="mt-4 mb-2 flex">
                  <div>Review</div>
                </div>
                <textarea placeholder="Rentcar.id is awesome" maxLength={450} rows={5} onChange={writeReview}
                  className="bg-blue-100 hover:bg-red-200 focus:bg-red-200 block w-full border-none rounded-xl shadow-lg focus:ring-0"
                />
                <button onClick={sendReview}
                  className="inline-flex mt-4 mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Send Review
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}