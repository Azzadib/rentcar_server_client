import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allUserActions, deleteUserActions, } from '../../Redux/Actions/UserActions'
import DashboardData from '../../SericeApis/DashboardData'
import { TrashIcon, PencilAltIcon } from '@heroicons/react/outline'
import avatar from '../../assets/svg/avatar.svg'
import { scrollActions } from '../../Redux/Actions/ScrollActions'
import { allCarActions, deleteCarActions } from '../../Redux/Actions/CarActions'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import { globalOrderActions } from '../../Redux/Actions/OrderActions'

export default function Dashboard() {
  const dispatch = useDispatch()
  const [utrigger, setUtrigger] = useState(false)
  const [ctrigger, setCtrigger] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scrolled = document.scrollingElement.scrollTop;
      dispatch(scrollActions(scrolled))
    })
  }, [])

  const [usercount, setUsercount] = useState({ total_user: 0 })
  const userList = useSelector(state => state.userList)
  const userLoad = userList.loading
  const { alluser } = userList

  const [carcount, setCarcount] = useState({
    all_car: 0,
    total_sedan: 0,
    total_suv: 0,
    total_truck: 0
  })
  const carList = useSelector(state => state.carList)
  const carLoad = carList.loading
  const { allcar } = carList

  const [ordercount, setOrdercount] = useState({
    all_order: 0,
    open_order: 0,
    paid_order: 0,
    cancelled_order: 0,
    active_order: 0,
    closed_order: 0
  })
  const orderList = useSelector(state => state.orderList)
  const orderLoad = orderList.loading
  const { globalorder } = orderList

  useEffect(() => {
    DashboardData.userCount().then((result) => setUsercount(result))
    dispatch(allUserActions())
  }, [utrigger])

  useEffect(() => {
    DashboardData.carCount().then((result) => setCarcount(result))
    dispatch(allCarActions())
  }, [ctrigger])

  useEffect(() => {
    DashboardData.orderCount().then((result) => setOrdercount(result))
    dispatch(globalOrderActions())
  }, [])

  const deleteUser = (uid) => {
    dispatch(deleteUserActions(uid)).then((result) => {
      console.log('Delete user:', result)
      setUtrigger(!utrigger)
    })
  }

  const userFilter = {
    userdata(userid) {
      const result = alluser.filter((u) => { if (u.user_id == userid) return u.user_email })
      return { id: result[0].user_id, email: result[0].user_email, avatar: result[0].user_avatar }
    },
  }

  const deleteCar = (cid) => {
    dispatch(deleteCarActions(cid)).then((result) => {
      console.log('del car', result)
      setCtrigger(!ctrigger)
    })
  }

  const orderstatus = [
    { status: 'open', count: ordercount.open_order },
    { status: 'paid', count: ordercount.paid_order },
    { status: 'rent', count: ordercount.active_order },
    { status: 'closed', count: ordercount.closed_order },
    { status: 'cancelled', count: ordercount.cancelled_order },
  ]

  return (
    <div className="flex-1 max-h-full p-5 pt-28 overflow-hidden bg-gray-200">
      <div
        className="flex flex-col items-start justify-between pb-6 space-y-4 border-b lg:items-center lg:space-y-0 lg:flex-row"
      >
        <h1 className="text-2xl font-semibold whitespace-nowrap">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-9">
        <div className="col-span-2">
          <div className="p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex flex-col my-auto">
                <span className="text-red-600 font-bold text-lg">Customers</span>
              </div>
              <div className="py-6 w-24 text-center bg-red-400 rounded-md text-white text-3xl">{usercount.total_user}</div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="text-green-600 font-bold text-lg text-center">Cars</div>
                <div className="flex gap-x-12 justify-center pr-3">
                  <div className="text-center text-green-600">
                    <div className="font-semibold">SUV</div>
                    <div className="rounded-full w-12 text-xl bg-green-400 text-white">{carcount.total_suv}</div>
                  </div>
                  <div className="text-center text-green-600">
                    <div className="font-semibold">Sedan</div>
                    <div className="rounded-full w-12 text-xl bg-green-400 text-white">{carcount.total_sedan}</div>
                  </div>
                  <div className="text-center text-green-600">
                    <div className="font-semibold">Truck</div>
                    <div className="rounded-full w-12 text-xl bg-green-400 text-white">{carcount.total_truck}</div>
                  </div>
                </div>
              </div>
              <div className="py-6 w-24 text-center bg-green-400 text-white rounded-md text-3xl">{carcount.all_car}</div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-lg col-span-2">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="text-blue-600 font-bold text-lg text-center">Orders</div>
                <div className="flex gap-x-1 justify-between pr-3">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Unpaid</div>
                    <div className="rounded-full w-12 text-xl bg-blue-400 text-white">{ordercount.open_order}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Coming</div>
                    <div className="rounded-full w-12 text-xl bg-blue-400 text-white">{ordercount.paid_order}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Active</div>
                    <div className="rounded-full w-12 text-xl bg-blue-400 text-white">{ordercount.active_order}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Finished</div>
                    <div className="rounded-full w-12 text-xl bg-blue-400 text-white">{ordercount.closed_order}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Cancelled</div>
                    <div className="rounded-full w-12 text-xl bg-blue-400 text-white">{ordercount.cancelled_order}</div>
                  </div>
                </div>
              </div>
              <div className="py-6 w-28 text-center bg-blue-400 rounded-md text-3xl text-white">{ordercount.all_order}</div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-6 text-xl text-center">Users</h3>
      <div className="flex flex-col mt-1">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 bg-blue-100 rounded-md shadow-md overflow-y-auto">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between px-4 w-full py-2 text-sm font-medium text-left bg-blue-200 rounded-lg hover:bg-blue-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      User Data ({userLoad ? 0 : alluser.length})
                      <ChevronDownIcon
                        className={`${open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-blue-900`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 mt-4 text-sm overflow-y-scroll max-h-96">
                      <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr className="bg-gray-200 font-bold shadow-md">
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase border-l border-white"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase border-l border-white"
                            >
                              Gender
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase border-l border-white"
                            >
                              Birthdate
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider uppercase border-l border-white"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {
                            userLoad ?
                              ''
                              :
                              alluser.map((user) => (
                                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 w-10 h-10">
                                        <img
                                          className="w-10 h-10 rounded-full"
                                          src={user.user_avatar ? `http://localhost:3000/api/user/avatar/${user.user_id}/${user.user_avatar}` : avatar}
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                                        <div className="text-sm text-gray-500">{user.user_type}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                    <div className="text-sm text-gray-900">{user.user_email}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                    <span
                                      className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full"
                                    >
                                      {user.user_gender ? `${user.user_gender[0].toUpperCase()} ${user.user_gender.substring(1)}` : 'Not defined'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm whitespace-nowrap text-center border-l border-white">{user.user_birthdate ? user.user_birthdate : '-'}</td>
                                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap border-l border-white">
                                    <TrashIcon className="w-6 mx-auto text-red-600 hover:cursor-pointer" onClick={() => deleteUser(user.user_id)} />
                                  </td>
                                </tr>
                              ))
                          }
                        </tbody>
                      </table>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-6 text-xl text-center">Cars</h3>
      <div className="flex flex-col mt-1">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 bg-blue-100 rounded-md shadow-md overflow-y-auto">
              <Disclosure defaultOpen="true">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between px-4 w-full py-2 text-sm font-medium text-left bg-blue-200 rounded-lg hover:bg-blue-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      Car Data ({carcount.all_car})
                      <ChevronDownIcon
                        className={`${open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-blue-900`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 mt-4 text-sm overflow-y-scroll max-h-96">
                      <div className="mb-6 flex justify-center">
                        <button className="flex focus:outline-none" onClick={() => window.location="/admin/addcar"}>
                        <div className="my-auto font-bold text-lg bg-blue-800 pl-5 pr-5 rounded-full text-white -mr-5">+++</div>
                        <div className="bg-blue-800 text-white font-semibold px-3 py-2 rounded-full text-lg z-10">Add car</div>
                        <div className="my-auto font-bold text-lg bg-blue-800 pr-5 pl-5 rounded-full text-white -ml-5">+++</div>
                        </button>
                      </div>
                      {
                        carcount.all_car > 0 ?
                          <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr className="bg-gray-200 font-bold shadow-md">
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-left uppercase"
                                >
                                  Manufacturer
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-left uppercase border-l border-white"
                                >
                                  Model
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-left uppercase border-l border-white"
                                >
                                  Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-left uppercase border-l border-white"
                                >
                                  Number
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                >
                                  Price (Rp)
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                >
                                  Status
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                >
                                  User
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-xs tracking-wider uppercase border-l border-white"
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {
                                carLoad ?
                                  ''
                                  :
                                  allcar.map((car) => (
                                    <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{car.car_manufacturer}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                        <div className="text-sm text-gray-900">{car.car_model}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                        <div className="text-sm text-gray-900 uppercase">{car.car_type}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                        <span
                                          className="inline-flex px-2 text-sm leading-5 text-blue-800 bg-blue-100 rounded-full"
                                        >
                                          {car.car_number}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-sm whitespace-nowrap text-center border-l border-white">{car.car_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
                                      <td className="py-4 whitespace-nowrap border-l border-white">
                                        <div className={`${car.car_user_id == null ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} text-center px-2 text-sm rounded-full`}>{car.car_user_id == null ? 'Open' : 'Leased'}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                        <div className="text-sm text-gray-900 flex">
                                          <img
                                            className="w-10 h-10 rounded-full"
                                            src={car.car_user_id == null ? '' : userFilter.userdata(car.car_user_id).avatar ? `http://localhost:3000/api/user/avatar/${userFilter.userdata(car.car_user_id).id}/${userFilter.userdata(car.car_user_id).avatar}` : avatar}
                                          />
                                          <div className="my-auto mx-2 text-center">{car.car_user_id == null ? '' : userFilter.userdata(car.car_user_id).email}</div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap border-l border-white">
                                        <div className="flex">
                                          <PencilAltIcon onClick={() => window.location = `/admin/editcar/${car.car_id}`}
                                            className="w-6 mx-auto text-purple-600 hover:cursor-pointer"
                                          />
                                          <TrashIcon onClick={() => deleteCar(car.car_id)}
                                            className="w-6 mx-auto text-red-600 hover:cursor-pointer"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                              }
                            </tbody>
                          </table>
                          :
                          <div className="text-center font-bold">No car found</div>
                      }
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-6 text-xl text-center">Orders</h3>
      {
        orderstatus.map((ord) => (
          <div className="flex flex-col mt-1 mb-5">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full max-w-screen-lg py-2 align-middle sm:px-6 lg:px-8">
                <div className={`${ord.status == 'open' ? 'bg-yellow-100' : ord.status == 'cancelled' ? 'bg-red-100' : 'bg-green-100'} overflow-hidden border-b border-gray-200 rounded-md shadow-md overflow-y-auto`}>
                  <Disclosure defaultOpen={ord === 'open'}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={`${ord.status == 'open' ? 'bg-yellow-200 hover:bg-yellow-400 bg' : ord.status == 'cancelled' ? 'bg-red-200 hover:bg-red-400' : 'bg-green-200 hover:bg-green-400'} flex justify-between px-4 w-full py-2 text-sm font-medium text-left text-blue-900 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}>
                          {ord.status == 'open' ? 'Wating for payment' : ord.status == 'rent' ? 'Active' : `${ord.status[0].toUpperCase()}${ord.status.substring(1)}`} Order ({ord.count})
                          <ChevronDownIcon
                            className={`${open ? 'transform rotate-180' : ''
                              } w-5 h-5 text-blue-900`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pb-2 mt-4 text-sm overflow-y-scroll max-h-96">
                          {
                            ord.count > 0 ?
                              <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                  <tr className="bg-gray-200 font-bold shadow-md">
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-left uppercase"
                                    >
                                      Order Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-left uppercase border-l border-white"
                                    >
                                      Created On
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-left uppercase border-l border-white"
                                    >
                                      Total (Rp)
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                    >
                                      Payment Number
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                    >
                                      City
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-xs tracking-wider text-center uppercase border-l border-white"
                                    >
                                      User
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-xs tracking-wider uppercase border-l border-white"
                                    >
                                      Duration
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {
                                    orderLoad ?
                                      ''
                                      :
                                      globalorder.map((order) => (
                                        order.order_status == ord.status ?
                                          <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div>
                                                  <div className="text-sm font-medium text-gray-900">{order.order_name}</div>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                              <div className="text-sm text-gray-900">{(new Date(order.order_created_on)).toString().split(' GMT')[0]}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                              <div className="text-sm text-gray-900 uppercase">{order.order_total_due.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-center">{order.order_pay_trx_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                              <div className="text-sm text-gray-900">{order.order_city}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                              <div className="text-sm text-gray-900 flex">
                                                <img
                                                  className="w-10 h-10 rounded-full"
                                                  src={order.order_user_id == null ? '' : userFilter.userdata(order.order_user_id).avatar ? `http://localhost:3000/api/user/avatar/${userFilter.userdata(order.order_user_id).id}/${userFilter.userdata(order.order_user_id).avatar}` : avatar}
                                                />
                                                <div className="my-auto mx-2 text-center">{order.order_user_id == null ? '' : userFilter.userdata(order.order_user_id).email}</div>
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-l border-white">
                                              <div className="text-sm text-gray-900">{Math.round(order.order_total_days / 7)} w {order.order_total_days % 7} d</div>
                                            </td>
                                          </tr>
                                          :
                                          ''
                                      ))
                                  }
                                </tbody>
                              </table>
                              :
                              <div className="text-center font-bold">No {ord.status[0].toUpperCase()}{ord.status.substring(1)} order</div>
                          }
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}