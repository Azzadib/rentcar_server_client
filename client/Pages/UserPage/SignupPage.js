import React, { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'
import { useDispatch, useSelector } from 'react-redux'
import { signupActions } from '../../Redux/Actions/UserActions'
import wheel from '../../assets/svg/steering-wheel.svg'
import { Link } from 'react-router-dom'

export default function SignupPage(props) {
  const from = props.location.from
  const [visible, setVisible] = useState(false)
  const [convisible, setConvisible] = useState(false)
  const [agree, setAgree] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const [errmsg, setErrmsg] = useState('')
  const [succmsg, setSuccmsg] = useState('')

  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.login)
  useEffect(() => {
    if (userinfo) {
      const { user } = userinfo
      if (user) window.history.back()
    }
  }, [dispatch])

  const [userdata, setUserdata] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
    user_confirm_password: '',
  })

  const handleOnChange = field => event => {
    setUserdata({...userdata, [field]: event.target.value})
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (validation()) {
      setWaiting(true)
      const senduser = {
        user_name: userdata.user_name,
        user_email: userdata.user_email,
        user_password: userdata.user_password,
      }

      dispatch(signupActions(senduser)).then((res) => {
        if (res.status === 201) {
          setWaiting(false)
          setSuccmsg('Signup success.')
          setUserdata({})
          window.location = "/login"
        }
        else {
          setWaiting(false)
          setErrmsg(res.message)
        }
      })
    }
  }

  const validation = () => {
    setErrmsg('')
    setSuccmsg('')

    if (!userdata.user_name || !userdata.user_name.match(/^[a-zA-Z0-9_]+([ a-zA-Z0-9_]+){2}$/)) {
      setErrmsg('Name should be at least 2 characters of alphabet, number or " _ ".')
      return false
    }

    if (!userdata.user_email.match(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)) {
      setErrmsg('Please insert valid email.')
      return false
    }

    if (!userdata.user_password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
      setErrmsg('Password at least 8 characters of uppercase, lowercase, and special character.')
      return false
    }

    if (userdata.user_password !== userdata.user_confirm_password) {
      setErrmsg('Password doesn\'t match.')
      return false
    }

    if (!agree) {
      setErrmsg('You have to agree our terms and condition to register')
      return false
    }

    return true
  }

  return (
    <div className="font-sans">
      <div className={waiting? 'absolute bg-black bg-opacity-60 w-screen h-100v z-30' : 'hidden'}></div>
      <div className={waiting? 'absolute z-30 w-screen' : 'hidden'}>
        <img src={wheel} className="w-40 mx-auto my-auto mt-44 animate-spin"/>
      </div>
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-green-200 ">
        <div className={`${errmsg? 'py-1' : ''} font-bold text-center text-white mb-5 w-64 bg-red-300 rounded-xl text-sm`}>{errmsg}</div>
        <div className={`${succmsg? 'py-1' : ''} font-bold text-center text-white mb-5 w-64 bg-blue-300 rounded-xl text-md`}>{succmsg}</div>
        <div className="relative sm:max-w-sm w-full">
          <div className="bg-blue-500 shadow-lg w-full h-72v rounded-3xl absolute transform -rotate-6"></div>
          <div className="bg-red-500 shadow-lg w-full h-72v rounded-3xl absolute transform rotate-6"></div>
          <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
            <label className="block mt-3 text-sm text-gray-700 text-center font-semibold">
              Create new account
            </label>
            <form className="mt-7">
              <div>
                <input type="text" placeholder="Full Name" onChange={handleOnChange('user_name')}
                  className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"/>
              </div>
              <div className="mt-7">
                <input type="email" placeholder="Email" onChange={handleOnChange('user_email')}
                  className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"/>
              </div>
              <div className="mt-7">
                <input type={visible? 'text' : 'password'} placeholder="Password" onChange={handleOnChange('user_password')}
                  className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"/>
                <div className="absolute w-5 right-10 bottom-48 mb-4 text-red-500" onClick={() => setVisible(!visible)}>
                  {visible? <EyeIcon/> : <EyeOffIcon/>}
                </div>
              </div>
              <div className="mt-7">
                <input type={convisible? 'text' : 'password'} placeholder="Confirm Password"onChange={handleOnChange('user_confirm_password')}
                  className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"/>
                <div className="absolute w-5 right-10 bottom-32 mb-2 text-red-500" onClick={() => setConvisible(!convisible)}>
                  {convisible? <EyeIcon/> : <EyeOffIcon/>}
                </div>
              </div>
              <div className="flex text-sm mt-1 ml-2">
                <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)}
                  className=" focus:ring-0 mt-2"
                />
                <div className="mt-1 mx-1">I have read and agree the</div>
                <div className="underline mt-1 hover:cursor-pointer">terms and condition</div>
              </div>
              <div className="mt-3">
                <button onClick={handleOnSubmit}
                  className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                  Register
                </button>
              </div>
              <div className="text-center">Already have account? <span className="underline"><Link to="/login">Login now.</Link></span></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}