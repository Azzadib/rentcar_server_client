import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Listbox, Transition, Dialog } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useDispatch, useSelector } from 'react-redux'
import { carDetailActions, createCarActions, editCarActions } from '../../Redux/Actions/CarActions'
import plus from '../../assets/svg/plus.svg'
import Caim from '../../SericeApis/Caim'
import { createImageActions, deleteImageActions } from '../../Redux/Actions/CarImageActions'

export default function HandleCar() {
  const { carid } = useParams()
  const [saving, setSaving] = useState(false)

  const [openDialog, setOpenDialog] = useState(false)

  const [onMainImg, setOnMainImg] = useState(false)
  const [slctImgId, setSlctImgId] = useState()
  const [slctImgIdx, setSlctImgIdx] = useState()

  const [imgAdded, setImgAdded] = useState(false)

  const dispatch = useDispatch()

  const [car, setCar] = useState({
    car_manufacturer: '',
    car_model: '',
    car_number: '',
    car_description: '',
    car_price: null,
  })

  const [mainImg, setMainImg] = useState({
    id: undefined,
    name: undefined,
    imgfile: undefined,
    img: undefined,
    isNew: false,
  })
  const [secImg, setSecImg] = useState([])

  const typeLists = [
    { item: 'SUV' },
    { item: 'Sedan' },
    { item: 'Truck' }
  ]
  const [type, setType] = useState(typeLists[0])

  const passengerLists = [
    { item: 2 },
    { item: 3 },
    { item: 5 },
    { item: 8 },
    { item: 10 },
  ]
  const [passenger, setPassenger] = useState(passengerLists[0])

  const doorLists = [
    { item: 2 },
    { item: 4 },
    { item: 5 },
  ]
  const [door, setDoor] = useState(doorLists[0])

  const [baggage, setBaggage] = useState(false)
  const [ac, setAc] = useState(false)

  const carData = useSelector((state) => state.carDetail)
  const { loading } = carData
  useEffect(() => {
    if (carid && !carData.car.car_id) dispatch(carDetailActions(carid))
    if (carid) {
      setCar({
        car_manufacturer: carData.car.car_manufacturer,
        car_model: carData.car.car_model,
        car_number: carData.car.car_number,
        car_description: carData.car.car_description,
        car_price: carData.car.car_price,
      })

      setType({ item: carData.car.car_type })
      setPassenger({ item: carData.car.car_passenger })
      setDoor({ item: carData.car.car_door })
      setAc(carData.car.car_ac)
      setBaggage(carData.car.car_baggage)

      if (carData.car.car_images) {
        carData.car.car_images.map((image) => {
          Caim.download(carData.car.car_number, image.caim_filename).then(result => {
            if (image.caim_primary) setMainImg({
              id: image.caim_id,
              name: result.name,
              imgfile: result,
              img: URL.createObjectURL(result),
              isNew: false
            })
            else setSecImg(secImg => [...secImg, {
              id: image.caim_id,
              name: result.name,
              imgfile: result,
              img: URL.createObjectURL(result),
              isNew: false
            }])
          })
        })
      }
    }
  }, [carid, loading])

  const handleOnChange = field => event => {
    if (field !== 'car_price') setCar({ ...car, [field]: event.target.value })
    if (field === 'car_price') if (!isNaN(event.target.value)) setCar({ ...car, [field]: event.target.value })
  }

  const holdImg = event => {
    if (onMainImg) {
      setMainImg({
        ...mainImg,
        name: event.target.files[0].name,
        imgfile: event.target.files[0],
        img: URL.createObjectURL(event.target.files[0]),
        isNew: true
      })
      setImgAdded(true)
      setOnMainImg(false)
      setOpenDialog(false)
    }
    else {
      const files = Object.values(event.target.files)
      files.map((file) => {
        setSecImg(secImg => [...secImg, {
          id: undefined,
          name: file.name,
          imgfile: file,
          img: URL.createObjectURL(file),
          isNew: true
        }])
      })
      setImgAdded(true)
    }
  }

  const deleteImg = () => {
    setOpenDialog(false)
    console.log('id:', slctImgId)

    dispatch(deleteImageActions(carid, slctImgId)).then((result) => {
      console.log('result', result)
      if (result.data.status === 200) {
        console.log('success')
        if (onMainImg) {
          setMainImg({
            id: undefined,
            name: undefined,
            imgfile: undefined,
            img: undefined,
            isNew: false,
          })
        }
        else {
          /* const a = secImg
          const b = a.splice(slctImgIdx, 1) */
          const a = secImg.splice(slctImgIdx, 1)
          setSecImg(a)
        }
      }
      else console.log('delete img', result.data.data.message)
    })
  }

  const handleOnCreate = event => {
    event.preventDefault()
    setSaving(true)
    const car_baggage = baggage ? 1 : 0
    const car_ac = ac ? 1 : 0

    let cardata = new FormData()
    if (car.car_manufacturer) cardata.append('car_manufacturer', car.car_manufacturer)
    if (car.car_model) cardata.append('car_model', car.car_model)
    if (car.car_price) cardata.append('car_price', car.car_price)
    cardata.append('car_passenger', passenger.item)
    cardata.append('car_baggage', car_baggage)
    cardata.append('car_door', door.item)
    cardata.append('car_ac', car_ac)
    cardata.append('car_type', type.item)
    if (car.car_description) cardata.append('car_description', car.car_description)

    if (mainImg.isNew) cardata.append(1, mainImg.imgfile)

    if (secImg.length > 0) {
      secImg.map((img) => {
        if (img.isNew) cardata.append(0, img.imgfile)
      })
    }

    dispatch(createCarActions(car.car_number, cardata)).then((result) => {
      setSaving(false)
      console.log('result', result)
      if (result.data.status === 200) window.location = `/detail/${result.data.data.car_id}`
      else console.log(result.data.data.message)
    })
  }

  const handleOnEdit = event => {
    event.preventDefault()
    setSaving(true)

    const car_baggage = baggage ? 1 : 0
    const car_ac = ac ? 1 : 0

    const cardata = {
      car_manufacturer: car.car_manufacturer,
      car_model: car.car_model,
      car_price: car.car_price,
      car_passenger: passenger.item,
      car_baggage: car_baggage,
      car_ac: car_ac,
      car_door: door.item,
      car_type: type.item,
      car_description: car.car_description
    }

    dispatch(editCarActions(carid, cardata)).then((result) => {
      console.log(result)
      setSaving(false)
      if (result.data.status === 201) console.log('success')
      else console.log(result.data.data.message)
    })

    if (imgAdded) {
      let newImg = new FormData()
      if (mainImg.isNew) newImg.append(1, mainImg.imgfile)
      if (secImg.length > 0) {
        secImg.map((img) => {
          if (img.isNew) newImg.append(0, img.imgfile)
        })
      }
      dispatch(createImageActions(car.car_number, newImg)).then((result) => {
        console.log(result)
      })
    }
  }

  const selectorWidget = (type, setted) => (
    <div className="">
      <Listbox value={type} onChange={type === typeLists ? setType : type === passengerLists ? setPassenger : setDoor}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button className="relative w-full py-1 pl-3 pr-6 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{setted.item}</span>
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
                  {type.map((component, itemIdx) => (
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
                            {component.item}
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
  )

  const checkWidget = (type, text) => (
    <label for={type} className="inline-flex items-center w-full cursor-pointer">
      <input id={type} checked={type} onChange={() => text === 'Baggage' ? setBaggage(!baggage) : setAc(!ac)} type="checkbox" name="agree"
        className="rounded border-gray-300 text-red-500 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <span className="ml-1 text-base">
        {text}
      </span>
    </label>
  )

  return (
    <div className="bg-gray-200">
      <div className="relative min-h-screen px-2 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-4 lg:pt-20 lg:pb-18">
        <div className="container mx-auto pt-10 flex flex-wrap gap-5">
          <div className="flex flex-wrap z-40 w-screen">
            <div className="lg:w-1/3">
              <img src={mainImg.img} onClick={() => { setOnMainImg(true); setSlctImgId(mainImg.id); setOpenDialog(true) }}
                className="mb-3 w-96 h-50v border-red-500 border-2 object-cover overflow-hidden"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg" }}
              />
              <Transition appear show={openDialog} as={Fragment}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-50 overflow-y-auto"
                  onClose={() => setOpenDialog(false)}
                  open={openDialog}
                >
                  <div className="min-h-screen px-4 text-center">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    <span
                      className="inline-block h-screen align-middle"
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
                      <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Choose Action
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You can edit or delete this image.
                          </p>
                        </div>
                        <div className="mt-4 flex mx-auto">
                          <button onClick={() => { }}
                            type="button"
                            className="inline-flex mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          >
                            <label for="image" className="hover:cursor-pointer">
                              <span>{carid ? 'Edit Image' : 'Add Image'}</span>
                              <input id="image" accept="image/*" name="image" value={''} type="file" onChange={holdImg} className="sr-only" />
                            </label>
                          </button>
                          <button
                            type="button" onClick={deleteImg}
                            className={carid ? "inline-flex mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" : 'hidden'}
                          >
                            Delete Image
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition>
              <div className="flex flex-wrap">
                {
                  secImg && secImg.length > 0 ?
                    secImg.map((image, index) => (
                      <img src={image.img} key={index} onClick={() => { setOnMainImg(false); setSlctImgId(image.id); setSlctImgIdx(index); setOpenDialog(true) }}
                        className="w-20 h-10v mr-5 mb-2 border-red-500 border-2 overflow-hidden object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg" }}
                      />
                    ))
                    :
                    ''
                }
              </div>
              <div
                className="flex w-56 overflow-hidden py-1 px-2 rounded-l-full focus:outline-none border-2 bg-red-500"
              >
                <div
                  className="bg-gray-200 rounded-full text-white font-extrabold text-2xl px-3 my-auto">
                  <img src={plus} className="w-4 py-3" />
                </div>
                <div className="my-auto ml-1 text-sm text-left text-white">Secondary image</div>
                <input id="image" multiple={!onMainImg} accept="image/*" name="image" value={''} type="file" onChange={holdImg} className="w-32 my-auto" />
              </div>
            </div>
            <div className="font-semibold text-lg lg:w-2/3">
              <div className="flex">
                <div className="flex w-1/2">
                  <div>
                    <div>Manufacturer</div>
                    <div>Model</div>
                    <div>Number</div>
                    <div>Price</div>
                    <div>Description</div>
                  </div>
                  <div className="mx-2">
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                    <div>:</div>
                  </div>
                  <div className="w-full pr-5">
                    <div>
                      <input value={car.car_manufacturer}
                        onChange={handleOnChange('car_manufacturer')}
                        className="bg-gray-200 w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <input value={car.car_model}
                        onChange={handleOnChange('car_model')}
                        className="bg-gray-200 w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <input value={car.car_number}
                        onChange={handleOnChange('car_number')} placeholder="ex: A0000AA"
                        className="bg-gray-200 w-full focus:outline-none" readOnly={carid}
                      />
                    </div>
                    <div className="flex">
                      <div className="mr-1">Rp</div>
                      <input value={car.car_price} placeholder="0"
                        onChange={handleOnChange('car_price')}
                        className="bg-gray-200 border-none w-full focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    <div>Passenger</div>
                    <div className="my-2">Door</div>
                    <div>Type</div>
                    <div className="mt-2">Facilities</div>
                  </div>
                  <div className="mx-2">
                    <div>:</div>
                    <div className="my-2">:</div>
                    <div>:</div>
                    <div className="mt-2">:</div>
                  </div>
                  <div>
                    <div className="-mt-1 w-14">{selectorWidget(passengerLists, passenger)}</div>
                    <div className="my-2 w-12">{selectorWidget(doorLists, door)}</div>
                    <div className="my-2 w-20">{selectorWidget(typeLists, type)}</div>
                    <div className="flex">
                      <div>{checkWidget(ac, 'Ac')}</div>
                      <div className="mx-3">{checkWidget(baggage, 'Baggage')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <textarea style={{ resize: "none" }} rows="8" value={car.car_description}
                className="w-full mt-2 notes border-dotted border-red-500 rounded-3xl focus:ring-0" maxLength="475" onChange={handleOnChange('car_description')} />
              <button onClick={carid ? handleOnEdit : handleOnCreate}
                className="bg-red-500 px-3 py-2 rounded-2xl text-white font-semibold text-2xl mt-2 float-right active:animate-bounce focus:outline-none"
              >
                {saving ? 'Saving' : carid ? 'Save changes' : 'Save data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}