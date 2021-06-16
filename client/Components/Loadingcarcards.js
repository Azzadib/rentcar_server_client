import React from 'react'

export default function LoadingCarCards() {
  return (
    <div className="bg-white w-72 z-40 shadow-lg cursor-pointer rounded transform hover:transform hover:scale-105 hover:border-2 duration-300 ease-in-out hover:border-red-500">
      <div className="absolute mx-2 bg-white rounded-3xl px-2 mt-2 text-white animate-pulse-med">Recommended</div>
      <div className="mb-2 animate-pulse-med">
        <div className="rounded-t w-full bg-gray-200 h-40v overflow-hidden object-cover"></div>
      </div>
      <div className="px-2">
        <div className="text-md bg-gray-200 px-4 rounded-full text w-1/2 text-gray-200 animate-pulse-med">model</div>
        <div className="text-sm bg-gray-200 px-4 rounded-full text text-gray-200 max-h-10 overflow-hidden mt-1"><br /><br /></div>
        <div className="grid grid-cols-2 mt-2">
          <div className="flex">
            <div className="bg-gray-200 text-gray-200 rounded-full px-4 animate-pulse-med">rating</div>
          </div>
          <div className="text-gray-200 bg-gray-200 rounded-full text-right animate-pulse-med">reviews</div>
        </div>
        <div className="mt-4 mb-2 flex text-gray-200">
          <div className="bg-gray-200 w-2/5 rounded-full animate-pulse-med">Rp</div>
          <button className="text-md font-semibold mx-auto animate-pulse-med bg-gray-200 px-4 rounded-xl hover:scale-110 hover:transform active:transform active:translate-y-1 active:border-none active:mb-1 focus:outline-none">Add to garage</button>
        </div>
      </div>
    </div>
  )
}