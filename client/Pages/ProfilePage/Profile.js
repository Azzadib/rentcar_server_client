import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import avatar from '../../assets/svg/avatar.svg'
import { userSpentActions, userUpdateActions } from '../../Redux/Actions/UserActions'
import DatePicker, { registerLocale } from 'react-datepicker'
import id from 'date-fns/locale/id'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { PencilAltIcon, CheckCircleIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import { parseISO } from 'date-fns'
registerLocale("id", id)

export default function Profile() {
  let userdata = useSelector(state => state.login)
  const [editdata, setEdit] = useState(false)
  const dispatch = useDispatch()

  const genderLists = ['Not Specified', 'Male', 'Female']
  const [userdetail, setUserDetail] = useState({
    user_id: undefined,
    user_name: '',
    user_email: '',
    user_birthdate: new Date(),
    user_gender: genderLists[0],
    user_avatar: '',
    user_type: ''
  })

  const [hist, setHist] = useState({
    total_success_order: 10,
    total_days: 0,
    total_spent: 0
  })

  useEffect(() => {
    if (userdata) {
      const { user } = userdata
      const birthdate = user.user_birthdate ? parseISO(user.user_birthdate) : ''
      setUserDetail({
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_birthdate: birthdate,
        user_gender: user.user_gender,
        user_avatar: user.user_avatar,
        user_type: user.user_type
      })

      dispatch(userSpentActions(user.user_id)).then((res) => {
        if (res.data.status == 200) setHist(res.data.data)
      })
    }
  }, [])

  const saveData = () => {
    setEdit(false)
    dispatch(userUpdateActions(userdetail.user_id, userdetail)).then((res) => {
      if (res.data.status == 201) {
        userdata = { ...userdata, user: userdetail }
        localStorage.getItem('userData') ? localStorage.setItem('userData', JSON.stringify(userdata)) : sessionStorage.setItem('userData', JSON.stringify(userdata))
      }
    })
  }

  const changeName = event => {
    setUserDetail({ ...userdetail, user_name: event.target.value })
  }

  return (
    <div className="pt-28 px-10 max-h-screen">
      <div className="bg-blue-300 flex rounded-xl px-3 py-2 shadow-lg text-lg">
        <img src={userdetail.user_id ? userdetail.user_avatar ? `http://localhost:3000/api/user/avatar/${userdetail.user_id}/${userdetail.user_avatar}` : avatar : avatar}
          className="ml-5 w-80 mt-5 rounded-full border-2 border-red-500"
        />
        <div className="my-auto ml-20 font-semibold">
          <div className="flex my-auto">
            <div>
              <div className="mb-2">Full Name</div>
              <div className="mb-2">Email</div>
              <div className="mb-2">Birthdate</div>
              <div className="mb-2">Gender</div>
              <div className="mb-2">Total success order</div>
              <div className="mb-2">Total days order</div>
              <div className="mb-2">Total spent</div>
            </div>
            <div className="mx-5">
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
              <div className="mb-2">:</div>
            </div>
            <div className="mx-5">
              <div className="mb-2">
                <input className="bg-transparent font-semibold w-64 focus:outline-none" readOnly={!editdata}
                  value={userdetail.user_name} onChange={changeName}
                />
              </div>
              <div className="mb-2">{userdetail.user_email}</div>
              <div className="mb-2">
                <DatePicker
                  className="h-5v w-32 bg-transparent font-semibold border-t-0 border-r-0 border-l-0 my-auto focus:ring-0"
                  selected={userdetail.user_birthdate}
                  onChange={(date) => setUserDetail({ ...userdetail, user_birthdate: date })}
                  maxDate={new Date()}
                  locale={id}
                  isClearable={editdata}
                  disabled={!editdata}
                  showDisabledMonthNavigation
                />
              </div>
              <div className="mb-2 flex">
                <div className={editdata ? 'hidden' : 'w-28'}>{userdetail.user_gender ? userdetail.user_gender : genderLists[0]}</div>
                <div className={editdata ? '-mt-1' : 'hidden'}>
                  <Listbox value={userdetail.user_gender} onChange={(value) => setUserDetail({ ...userdetail, user_gender: value })}>
                    {({ open }) => (
                      <>
                        <div className="relative">
                          <Listbox.Button className="relative w-32 py-1 pl-3 pr-6 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                            <span className="block truncate">{userdetail.user_gender ? userdetail.user_gender : genderLists[0]}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="w-5 h-5 text-red-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options static className="absolute w-auto z-20 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {genderLists.map((component, itemIdx) => (
                                <Listbox.Option
                                  key={itemIdx}
                                  className={({ active }) =>
                                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4 hover:bg-blue-200`
                                  }
                                  value={component}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`${selected ? 'font-medium' : 'font-normal'
                                          } block truncate`}
                                      >
                                        {component}
                                      </span>
                                      {selected ? (
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
                      </>
                    )}
                  </Listbox>
                </div>
              </div>
              <div className="mb-2">{hist.total_success_order}</div>
              <div className="mb-2">{hist.total_days ? hist.total_days : 0}</div>
              <div className="mb-2">{hist.total_spent ? `Rp${hist.total_spent.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` : `Rp0`}</div>
            </div>
          </div>
        </div>
        <div className={editdata ? 'hidden' : 'mt-10'}>
          <button onClick={() => setEdit(true)}
            className="flex bg-blue-700 text-white px-2 py-2 border-2 border-red-500 rounded-full focus:outline-none"
          >
            <div className="my-auto">Edit</div>
            <PencilAltIcon className="w-6 ml-1 my-auto" />
          </button>
        </div>
        <div className={editdata ? 'mt-10' : 'hidden'}>
          <button onClick={() => saveData()}
            className="flex bg-blue-700 text-white px-2 py-2 border-2 border-red-500 rounded-full focus:outline-none"
          >
            <CheckCircleIcon className="w-6 mr-1 my-auto" />
            <div className="my-auto">Save</div>
          </button>
        </div>
      </div>
    </div>
  )
}