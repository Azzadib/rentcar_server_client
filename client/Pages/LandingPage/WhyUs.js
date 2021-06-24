import React from 'react'
import appuser from '../../assets/svg/app-user.svg'
import handshake from '../../assets/svg/handshake.svg'
import insurance from '../../assets/svg/insurance.svg'
import callhelp from '../../assets/svg/help.svg'
import carrepair from '../../assets/svg/carrepair.svg'
import carwash from '../../assets/svg/carwash.svg'
import greencar from '../../assets/svg/greencar.svg'

export default function WhyUs() {
  return (
    <section>
      <div className="mx-auto my-14 text-center font-bold text-5xl">This is why You should trust us.</div>
      <div className="bg-white flex flex-wrap justify-center gap-x-3 mb-8">
        <div className="max-w-xs">
          <img src={appuser} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Order Online.</div>
          <div className="text-center bg-red-500 px-3 py-2 text-white rounded-b-full">Just take a seat, get your device and click your wanted car.</div>
        </div>
        <div className="max-w-xs">
          <img src={handshake} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Best Deals.</div>
          <div className="text-center bg-red-500 px-3 py-2 text-white rounded-b-full">With years of experience and thousands of customers, we know what you want before you say it.</div>
        </div>
        <div className="max-w-xs">
          <img src={insurance} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Full of Insurance.</div>
          <div className="text-center bg-red-500 px-3 py-2 text-white rounded-b-full">No one hopes experiencing an accident, but everyone should be ready for it. Our full coverage insurance is standing behind you.</div>
        </div>
        <div className="max-w-xs">
          <img src={callhelp} className="h-20v mx-auto hover:transform"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">24 Hour Help.</div>
          <div className="text-center bg-red-500 px-4 py-4 text-white rounded-b-full">Our customer care is always ready to help You. We will send our team if necessery.</div>
        </div>
      </div>
      <div className="bg-white flex flex-wrap justify-center gap-x-4">
        <div className="max-w-xs">
          <img src={carrepair} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Maintained Frequently.</div>
          <div className="text-center bg-red-500 px-3 py-2 text-white rounded-b-full">Your safety and comfort is meaningful for us. Our expert technician always done checking periodically.</div>
        </div>
        <div className="max-w-xs">
          <img src={carwash} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Washed After Used.</div>
          <div className="text-center bg-red-500 px-5 py-2 text-white rounded-b-full">All cars are clean and higene. We always clean our car everytime you return it. All washable parts is never missed.</div>
        </div>
        <div className="max-w-xs">
          <img src={greencar} className="h-20v mx-auto"/>
          <div className="text-center font-bold my-4 bg-red-500 text-white rounded-t-full py-1 text-2xl">Low Emission.</div>
          <div className="text-center bg-red-500 px-3 py-2 text-white rounded-b-full">We know your concern about our earth, and we start from our car. Low emission car is our lifestyle.</div>
        </div>
      </div>
    </section>
  )
}