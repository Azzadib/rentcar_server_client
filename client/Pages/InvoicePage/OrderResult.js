import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import Car from '../../SericeApis/Car'

export default function OrderResult() {
  const location = useLocation()
  const { items, ordersummary, order, orderdata, selectedCity } = location.data
  console.log('items ', items)
  console.log('summary ', ordersummary)
  console.log('order ', order)
  console.log('orderdata ', orderdata)
  console.log('selectedCity ', selectedCity)

  const userinfo = useSelector(state => state.login)
  const { user } = userinfo
  const [itemdetail, setItemdetail] = useState([])

  useEffect(() => {
    items.map((item) => {
      Car.getCar(item.lite_car_id).then((cardata) => {
        setItemdetail(itemdetail => [...itemdetail, {
          carprice: cardata.car_price,
          carmanufacturer: cardata.car_manufacturer,
          carmodel: cardata.car_model,
          liteprice: item.lite_price,
          litedays: item.lite_days,
        }])
      })
    })
  }, [])

  useEffect(() => {
    if (items.length === itemdetail.length) {
      console.log('items length', items.length)
      console.log('itemdetail length', itemdetail.length)
    }
  }, [itemdetail])
  console.log('itemdetail', itemdetail)

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
              <div>{orderdata ? orderdata.order_address : 'Full address'}</div>
              <div>{selectedCity ? selectedCity : 'City'}</div>
              <div>{orderdata ? orderdata.phone : ''}</div>
            </div>
            <div>
              <div className="flex mt-3">
                <div className="mr-2">Order number:</div>
                <div className="font-semibold text-blue-600">{order.order_name}</div>
              </div>
              <div className="flex">
                <div className="mr-2">Order date:</div>
                <div className="font-semibold text-blue-600">{order.order_created_on}</div>
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
                    <div>{ordersummary.total_car}</div>
                    <div>{ordersummary.total_days}</div>
                    <div>Rp{ordersummary.total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
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