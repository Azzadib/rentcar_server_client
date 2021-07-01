import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { orderLiteActions } from '../../Redux/Actions/OrderActions'
import Car from '../../SericeApis/Car'

export default function Invoice() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { order } = location.data
  const [waiting, setWaiting] = useState(true)

  const userinfo = useSelector(state => state.login)
  const { user } = userinfo
  const [itemdetail, setItemdetail] = useState([])

  const lites = useSelector(state => state.orderlite)
  const { loading } = lites
  useEffect(() => {
    dispatch(orderLiteActions(order.order_name))
  }, [order])

  useEffect(() => {
    setWaiting(true)
    if (!loading) {
      lites.orderlite.map((lite) => {
        Car.getCar(lite.lite_car_id).then((cardata) => {
          if (lite.lite_order_name == order.order_name) {
            setItemdetail(itemdetail => [...itemdetail, {
              carprice: cardata.car_price,
              carmanufacturer: cardata.car_manufacturer,
              carmodel: cardata.car_model,
              liteprice: lite.lite_price,
              litedays: lite.lite_days,
            }])
          }
        })
      })
    }
    setWaiting(false)
  }, [lites])

  return (
    <div className="bg-gray-200">
      <div className="relative mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:py-20 px-12 min-h-full">
        <div className="w-8/12 mx-auto mt-8 px-7 py-5 bg-white border-4 rounded-xl border-red-500">
          <div className="flex mb-8 justify-center mx-auto">
            <img src={logo} className="w-16 my-auto mr-3" />
            <div className="text-3xl text-red-500 my-auto font-bold">Rentcar.id</div>
          </div>
          <div className="flex justify-between">
            <div className="max-w-sm font-medium text-sm">
              <div>{user ? user.user_name : 'User Name'}</div>
              <div>{user ? user.user_email : 'User Email'}</div>
              <div>{order ? order.order_address : 'Full address'}</div>
              <div>{order ? order.order_city : 'City'}</div>
              <div>{order ? order.order_phone : ''}</div>
            </div>
            <div>
              <div className="flex">
                <div className="mr-2">Order number:</div>
                <div className="font-semibold text-blue-600">{order.order_name}</div>
              </div>
              <div className="flex">
                <div className="mr-2">Order date:</div>
                <div className="font-semibold text-blue-600">{order.order_created_on.split('T')[0]}</div>
              </div>
              <div className="flex">
                <div className="mr-2">Order status:</div>
                <div className="font-semibold text-blue-600">{order.order_status == 'open' ? 'Waiting payment' : `${order.order_status[0].toUpperCase()}${order.order_status.substring(1)}`}</div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <table className="min-w-full divide-y">
              <thead className="min-w-full bg-blue-200 divide-y border border-gray-400">
                <tr>
                  <th className="border border-gray-200">Car name</th>
                  <th className="border border-gray-200">Days</th>
                  <th className="border border-gray-200">Price</th>
                  <th className="border border-gray-200">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {
                  waiting ?
                    ''
                    :
                    itemdetail.map((item) => (
                      <tr>
                        <td className="border border-gray-200">{item.carmanufacturer} {item.carmodel}</td>
                        <td className="border border-gray-200 text-center">{item.litedays}</td>
                        <td className="border border-gray-200 w-36 pl-1">Rp{item.carprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
                        <td className="border border-gray-200 w-36 pl-1">Rp{item.liteprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
            <div className="flex mt-3">
              <div className="w-1/2"></div>
              <div>
                <div className="flex">
                  <div className="font-semibold">
                    <div>Total car</div>
                    <div>Total day</div>
                    <div>Total price</div>
                    <div>Discount</div>
                    <div>Tax</div>
                  </div>
                  <div className="mx-2">
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                  </div>
                  <div className="font-semibold">
                    <div>{lites.orderlite ? lites.orderlite.length : '-'}</div>
                    <div>{order.order_total_days}</div>
                    <div>Rp{(order.order_total_due -order.order_tax + order.order_discount).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                    <div>Rp{order.order_discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                    <div>Rp{order.order_tax.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                  </div>
                </div>
                <div className="flex ml-6 mt-4 border rounded-lg font-bold text-xl border-red-500 px-2 py-2">
                  <div>Total Payment</div>
                  <div className="mx-2">:</div>
                  <div>Rp{order.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}