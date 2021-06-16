import React from 'react'
import { Link } from 'react-router-dom'

export default function CarType() {
  const suvLink = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Fl4lO8e7vM9Xby4S7kda8wHaEA%26pid%3DApi&f=1"
  const sedanLink = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcarsguide-res.cloudinary.com%2Fimage%2Fupload%2Ff_auto%2Cfl_lossy%2Cq_auto%2Ct_cg_hero_large%2Fv1%2Feditorial%2F2021-Hyundai-i30-sedan-red-1001x565-1.jpg&f=1&nofb=1"
  const truckLink = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsc01.alicdn.com%2Fkf%2FHTB1GA78dIic_eJjSZFnq6xVwVXa8%2F202607596%2FHTB1GA78dIic_eJjSZFnq6xVwVXa8.jpg&f=1&nofb=1"

  return (
    <div className="bg-gray-100" id="car_type">
      <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="absolute inset-x-0 top-0 items-center justify-center hidden overflow-hidden md:flex md:inset-y-0">
          <svg
            viewBox="0 0 88 88"
            className="w-full max-w-screen-xl text-indigo-100"
          >
            <circle fill="currentColor" cx="44" cy="44" r="15.5" />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="44"
            />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="37.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="29.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="22.5"
            />
          </svg>
        </div>
        <div className="container mx-auto bg-gray-100 py-10 flex flex-wrap justify-center gap-x-10">
          <Link to="/view/sedan" className="bg-white w-80 z-40 shadow-lg cursor-pointer rounded transform hover:transform hover:scale-105 duration-300 ease-in-out">
            <div>
              <img src={sedanLink} alt="" className="rounded-t h-30v" />
            </div>
            <div className="p-4">
              <h2 className="text-2xl uppercase">Sedan</h2>
              <p className="font-light text-gray-500 text-lg my-2">For your maximum comfort</p>
              <p className="text-justify">Suitable for your short-time travel and activities. These pint-sized, bargain-priced models provide good fuel economy and versatile interiors with a tiny footprint. Expect trade-offs in comfort, ride, noise, and power.</p>
              <button className="block bg-gray-300 py-2 px-2 text-gray-600 text-center rounded shadow-lg uppercase font-light mt-6 hover:bg-gray-400 hover:text-white duration-300 ease-in-out">View all sedan</button>
            </div>
          </Link>
          <Link to="/view/suv" className="bg-white w-80 shadow-lg cursor-pointer rounded transform hover:scale-105 duration-300 ease-in-out">
            <div>
              <img src={suvLink} alt="" className="rounded-t h-30v" />
            </div>
            <div className="p-4">
              <h2 className="text-2xl uppercase">SUV</h2>
              <p className="font-light text-gray-500 text-lg my-2">Fit to all activities</p>
              <p className="text-justify">The most popular new cars on the market today, we have collections with models of all shapes and sizes. Carry more person, ride more distance and everything you need.</p>
              <button href="#" className="block bg-gray-300 py-2 px-2 text-gray-600 text-center rounded shadow-lg uppercase font-light mt-6 hover:bg-gray-400 hover:text-white duration-300 ease-in-out">View all SUV</button>
            </div>
          </Link>
          <Link to="/view/truck" className="bg-white w-80 shadow-lg cursor-pointer rounded transform hover:scale-105 duration-300 ease-in-out">
            <div>
              <img src={truckLink} alt="" className="rounded-t h-30v" />
            </div>
            <div className="p-4">
              <h2 className="text-2xl uppercase">Truck</h2>
              <p className="font-light text-gray-500 text-lg my-2">Provide very big space</p>
              <p className="text-justify">Gives You a very big space for load your furniture, electronics, or every big stuff. With our various size and type, just tell us what You need and get them in seconds. Don't forget to take your truck driving license with it.</p>
              <button href="#" className="block bg-gray-300 py-2 px-2 text-gray-600 text-center rounded shadow-lg uppercase font-light mt-6 hover:bg-gray-400 hover:text-white duration-300 ease-in-out">View all truck</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}