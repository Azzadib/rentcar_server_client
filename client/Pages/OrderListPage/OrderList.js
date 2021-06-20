import { Disclosure } from '@headlessui/react'
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

export default function OrderList() {
  const dispatch = useDispatch()

  const [waitpymnt, setWaitpymnt] = useState([])
  const [slctd, setSlctd] = useState()
  const [actvord, setActvord] = useState([])
  const [comingsoon, setComingsoon] = useState([])
  const [finished, setFinisihed] = useState([])
  const [cancelled, setCancelled] = useState([])

  const [waiting, setWaiting] = useState(true)

  const [pymntres, setPymntres] = useState('')

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
      dispatch(updateOrderActions('cancel', pymntres.order_number, { 'pyt_num': pymntres.payt_trx_number })).then((result) => {
        if (result.data.status === 201) {
          dispatch(allOrderActions(result.data.data.order_user_id)).then((res)=> {
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
    dispatch(updateOrderActions('cancelled', toCncl.order_name)).then((result) => {
      if (result.data.status === 201) {
        dispatch(allOrderActions(result.data.data.order_user_id)).then((res)=> {
          if (res.data.status == 200) window.location.reload()
          else console.log(res.data)
        })
      }
      else console.log(`error ${result.data.status}`, result)
    })
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
                                <button onClick={() => { if (window.confirm('Are you sure you wish to cancel this order?')) cancelOrder(list) } }
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
                                <img src={comingicon} className="w-16 ml-1 mr-5"/>
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
                                <button onClick={() => { if (window.confirm('Are you sure you wish to cancel this order?')) cancelOrder(list) } }
                                  className="my-auto ml-20 border-2 border-red-500 bg-red-500 px-6 py-2 rounded-full font-bold text-white shadow-lg focus:outline-none active:transform active:translate-y-1"
                                >
                                  Cancel
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
                                <img src={activeicon} className="w-16 ml-1 mr-5"/>
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
                                <img src={doneicon} className="w-16 ml-1 mr-5"/>
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
                                <img src={cancelicon} className="w-16 ml-1 mr-5"/>
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
                                <div className="my-auto ml-8 font-semibold text-lg text-blue-500">{list.order_pay_trx_number? `Payment number: ${list.order_pay_trx_number}` : ''}</div>
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
    </div>
  )
}